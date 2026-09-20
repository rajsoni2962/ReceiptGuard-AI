import os
import fitz  # PyMuPDF
from PIL import Image
from typing import Tuple, Dict, Any, List
import io

# Initialize RapidOCR engine lazily or globally
_ocr_engine = None

def get_ocr_engine():
    global _ocr_engine
    if _ocr_engine is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
            _ocr_engine = RapidOCR()
        except Exception as e:
            print(f"Warning: Could not initialize RapidOCR: {e}")
            _ocr_engine = None
    return _ocr_engine

def extract_text_from_file(file_path: str, filename: str) -> Dict[str, Any]:
    """
    Extracts raw text from PDF (native text or OCR fallback for scanned PDFs),
    Images (PNG, JPG, JPEG via RapidOCR), or TXT files.
    
    Returns a dictionary:
    {
        "raw_text": str,
        "method": "native_pdf" | "scanned_pdf_ocr" | "image_ocr" | "text_file",
        "confidence": float (0.0 to 1.0),
        "confidence_level": "High" | "Medium" | "Needs Verification",
        "pages_count": int,
        "lines": List[Dict[str, Any]]
    }
    """
    ext = os.path.splitext(filename)[1].lower()
    
    # 1. Plain Text File
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        return {
            "raw_text": text,
            "method": "text_file",
            "confidence": 1.0,
            "confidence_level": "High",
            "pages_count": 1,
            "lines": [{"text": line, "confidence": 1.0} for line in text.splitlines() if line.strip()]
        }

    # 2. PDF Files (Native text first, OCR fallback for scanned pages)
    elif ext == ".pdf":
        doc = fitz.open(file_path)
        pages_count = len(doc)
        native_text_parts = []
        
        for page in doc:
            native_text_parts.append(page.get_text().strip())
            
        full_native_text = "\n".join(native_text_parts).strip()
        
        # If native selectable text exists and has meaningful length (> 25 chars)
        if len(full_native_text) >= 25:
            doc.close()
            return {
                "raw_text": full_native_text,
                "method": "native_pdf",
                "confidence": 0.98,
                "confidence_level": "High",
                "pages_count": pages_count,
                "lines": [{"text": line, "confidence": 0.98} for line in full_native_text.splitlines() if line.strip()]
            }

        # If PDF has no extractable text layer (e.g. Scanned PDF), run OCR on rendered page images
        ocr = get_ocr_engine()
        scanned_lines = []
        confidences = []
        ocr_text_parts = []

        for page_num in range(pages_count):
            page = doc[page_num]
            # Render page to high-res pixmap (2x scale for crisp OCR)
            zoom = 2.0
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            img_bytes = pix.tobytes("png")
            
            if ocr:
                result, _ = ocr(img_bytes)
                if result:
                    for item in result:
                        # item format: [box, text, score]
                        line_text = item[1].strip()
                        score = float(item[2])
                        scanned_lines.append({"text": line_text, "confidence": score})
                        confidences.append(score)
                        ocr_text_parts.append(line_text)
        
        doc.close()
        raw_ocr_text = "\n".join(ocr_text_parts)
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.85
        conf_level = "High" if avg_conf >= 0.85 else ("Medium" if avg_conf >= 0.65 else "Needs Verification")

        return {
            "raw_text": raw_ocr_text if raw_ocr_text else full_native_text,
            "method": "scanned_pdf_ocr",
            "confidence": round(avg_conf, 3),
            "confidence_level": conf_level,
            "pages_count": pages_count,
            "lines": scanned_lines
        }

    # 3. Image Files (PNG, JPG, JPEG, WEBP)
    elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
        ocr = get_ocr_engine()
        if not ocr:
            # Fallback if OCR engine is unavailable
            with open(file_path, "rb") as f:
                img_data = f.read()
            return {
                "raw_text": f"Image file {filename} ({len(img_data)} bytes)",
                "method": "image_raw",
                "confidence": 0.5,
                "confidence_level": "Needs Verification",
                "pages_count": 1,
                "lines": []
            }

        result, _ = ocr(file_path)
        extracted_lines = []
        confidences = []
        text_lines = []

        if result:
            for item in result:
                # item format: [box, text, score]
                line_text = item[1].strip()
                score = float(item[2])
                extracted_lines.append({"text": line_text, "confidence": score})
                confidences.append(score)
                text_lines.append(line_text)

        raw_text = "\n".join(text_lines)
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.75
        conf_level = "High" if avg_conf >= 0.85 else ("Medium" if avg_conf >= 0.65 else "Needs Verification")

        return {
            "raw_text": raw_text,
            "method": "image_ocr",
            "confidence": round(avg_conf, 3),
            "confidence_level": conf_level,
            "pages_count": 1,
            "lines": extracted_lines
        }

    else:
        raise ValueError(f"Unsupported file extension: {ext}")
