import os
import hashlib
import shutil
import mimetypes
from typing import Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session

from app.config import settings
from app.models.db_models import Receipt

# Ensure vault and upload directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.VAULT_DIR, exist_ok=True)

def compute_file_hash(file_path: str) -> str:
    """
    Computes SHA-256 hash of a file for duplicate detection and integrity.
    """
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def check_duplicate_file(shopper_id: str, file_hash: str, db: Session) -> Optional[Receipt]:
    """
    Checks if this shopper has already uploaded and confirmed a receipt with the exact same file hash.
    """
    return db.query(Receipt).filter(
        Receipt.shopper_id == shopper_id,
        Receipt.file_hash == file_hash
    ).first()

def get_safe_filename(original_filename: str) -> str:
    """
    Sanitizes original filename while strictly preserving the extension.
    """
    base_name = os.path.basename(original_filename)
    safe_name = "".join(c for c in base_name if c.isalnum() or c in (".", "_", "-", " ")).strip()
    return safe_name or "receipt_document"

def get_media_type(filename: str, mime_type: Optional[str] = None) -> str:
    """
    Infers proper media MIME type for PDF, image formats, or plain text.
    """
    if mime_type and "/" in mime_type and "octet-stream" not in mime_type:
        return mime_type

    ext = os.path.splitext(filename)[1].lower()
    ext_map = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".txt": "text/plain",
        ".heic": "image/heic",
        ".heif": "image/heif"
    }
    return ext_map.get(ext, mimetypes.guess_type(filename)[0] or "application/octet-stream")

def get_file_type_category(filename: str) -> str:
    """
    Returns short normalized file type label: 'pdf', 'jpg', 'png', 'webp', 'txt'
    """
    ext = os.path.splitext(filename)[1].lower().replace(".", "")
    if ext in ["jpeg", "jpg"]:
        return "jpg"
    if ext in ["pdf", "png", "webp", "txt"]:
        return ext
    return ext or "unknown"

def promote_to_vault(
    temp_file_path: str,
    shopper_id: str,
    receipt_id: str,
    original_filename: str
) -> Dict[str, Any]:
    """
    Permanently stores the exact original uploaded document into the vault.
    Organizes by shopper directory with unique key:
    uploads/vault/{shopper_id}/{receipt_id}_{safe_filename}
    
    Returns metadata dictionary with:
    - storage_key (safe relative key)
    - storage_path (absolute filesystem path)
    - file_size (in bytes)
    - file_hash (SHA-256)
    - mime_type
    - file_type
    """
    if not os.path.exists(temp_file_path):
        raise FileNotFoundError(f"Temporary file '{temp_file_path}' does not exist.")

    safe_name = get_safe_filename(original_filename)
    shopper_vault_dir = os.path.join(settings.VAULT_DIR, shopper_id)
    os.makedirs(shopper_vault_dir, exist_ok=True)

    # Secure internal storage key: shopper_id/receipt_{receipt_id}_{safe_name}
    vault_filename = f"receipt_{receipt_id[:8]}_{safe_name}"
    storage_key = f"{shopper_id}/{vault_filename}"
    permanent_vault_path = os.path.join(shopper_vault_dir, vault_filename)

    # Copy / Move original bytes exactly as uploaded
    shutil.copy2(temp_file_path, permanent_vault_path)

    file_size = os.path.getsize(permanent_vault_path)
    file_hash = compute_file_hash(permanent_vault_path)
    mime_type = get_media_type(original_filename)
    file_type = get_file_type_category(original_filename)

    return {
        "storage_key": storage_key,
        "storage_path": permanent_vault_path,
        "file_size": file_size,
        "file_hash": file_hash,
        "mime_type": mime_type,
        "file_type": file_type,
        "original_filename": original_filename
    }

def resolve_vault_file_path(storage_key: str) -> Optional[str]:
    """
    Safely resolves a storage_key to an absolute path inside VAULT_DIR.
    Prevents path traversal attacks.
    """
    if not storage_key:
        return None

    # Clean traversal characters
    clean_key = os.path.normpath(storage_key).lstrip(os.path.sep).lstrip("/")
    full_path = os.path.abspath(os.path.join(settings.VAULT_DIR, clean_key))

    # Verify that resolved path is strictly within VAULT_DIR
    vault_root = os.path.abspath(settings.VAULT_DIR)
    if not full_path.startswith(vault_root):
        return None

    if os.path.exists(full_path) and os.path.isfile(full_path):
        return full_path

    return None

def delete_vault_file(storage_key: str) -> bool:
    """
    Safely removes a stored receipt document from the vault directory.
    """
    file_path = resolve_vault_file_path(storage_key)
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except Exception:
            return False
    return False
