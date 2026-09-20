import os
import chromadb
from typing import List, Dict, Any, Optional
from app.config import settings
import httpx
import hashlib

class ChromaService:
    def __init__(self):
        self.persist_dir = settings.CHROMA_PERSIST_DIR
        os.makedirs(self.persist_dir, exist_ok=True)
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        self.ollama_available = None

    def _get_collection_name(self, shopper_id: str) -> str:
        """Enforces shopper isolation by creating a unique collection name per shopper."""
        clean_id = "".join(c if c.isalnum() else "_" for c in shopper_id)
        return f"shopper_{clean_id}"

    def _fallback_vector(self, text: str) -> List[float]:
        """Deterministic 384-dim fallback pseudo-embedding for instant offline execution."""
        vector = []
        for i in range(384):
            val = int(hashlib.md5(f"{text}_{i}".encode('utf-8')).hexdigest(), 16) % 1000 / 1000.0
            vector.append(val)
        return vector

    def _generate_embedding(self, text: str) -> List[float]:
        """Generates embedding via Ollama, or fast deterministic fallback if offline."""
        if self.ollama_available is False:
            return self._fallback_vector(text)

        try:
            url = f"{settings.OLLAMA_BASE_URL}/api/embeddings"
            payload = {
                "model": settings.OLLAMA_EMBEDDING_MODEL,
                "prompt": text
            }
            # Short 0.5s timeout to prevent blocking if Ollama is offline
            response = httpx.post(url, json=payload, timeout=0.5)
            if response.status_code == 200:
                data = response.json()
                if "embedding" in data:
                    self.ollama_available = True
                    return data["embedding"]
        except Exception:
            self.ollama_available = False

        return self._fallback_vector(text)

    def index_receipt_items(
        self,
        shopper_id: str,
        receipt_id: str,
        store: str,
        purchase_date: str,
        items: List[Dict[str, Any]]
    ):
        """
        Indexes items using item-level chunking: ONE ITEM = ONE CHUNK.
        Collection is strictly isolated per shopper_id.
        """
        collection_name = self._get_collection_name(shopper_id)
        collection = self.client.get_or_create_collection(name=collection_name)

        documents = []
        metadatas = []
        ids = []
        embeddings = []

        for item in items:
            item_id = item.get("item_id", f"{receipt_id}_{item['name'].replace(' ', '_')}")
            doc_text = (
                f"Product: {item['name']}\n"
                f"Store: {store}\n"
                f"Purchase Date: {purchase_date}\n"
                f"Price: ₹{item['price']:.2f}\n"
                f"Category: {item['category']}\n"
                f"Serial Number: {item.get('serial_number') or 'None'}\n"
                f"Explicit Warranty: {item.get('warranty_days_if_explicit') or 'None'} days"
            )
            metadata = {
                "shopper_id": shopper_id,
                "receipt_id": receipt_id,
                "item_id": item_id,
                "store": store,
                "category": item['category'],
                "type": "receipt_item"
            }
            emb = self._generate_embedding(doc_text)

            documents.append(doc_text)
            metadatas.append(metadata)
            ids.append(f"item_{item_id}")
            embeddings.append(emb)

        if documents:
            collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings
            )

    def index_policy_sections(self, store: str, sections: List[Dict[str, Any]]):
        """Indexes store policy clauses into a global policy collection."""
        collection = self.client.get_or_create_collection(name="global_store_policies")

        documents = []
        metadatas = []
        ids = []
        embeddings = []

        for sec in sections:
            sec_id = sec.get("section_id", f"{store}_{sec['section_code']}")
            doc_text = (
                f"Store: {store}\n"
                f"Policy Section: {sec['section_code']} - {sec['title']}\n"
                f"Category: {sec['category']}\n"
                f"Policy Type: {sec['policy_type']}\n"
                f"Allowed Days: {sec['days_allowed']}\n"
                f"Text: {sec['full_text']}"
            )
            metadata = {
                "store": store,
                "section_code": sec['section_code'],
                "category": sec['category'],
                "policy_type": sec['policy_type'],
                "type": "policy"
            }
            emb = self._generate_embedding(doc_text)

            documents.append(doc_text)
            metadatas.append(metadata)
            ids.append(f"policy_{sec_id}")
            embeddings.append(emb)

        if documents:
            collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings
            )

    def query_shopper_documents(
        self,
        shopper_id: str,
        query: str,
        n_results: int = 3
    ) -> List[Dict[str, Any]]:
        collection_name = self._get_collection_name(shopper_id)
        try:
            collection = self.client.get_collection(name=collection_name)
        except Exception:
            return []

        query_emb = self._generate_embedding(query)
        results = collection.query(
            query_embeddings=[query_emb],
            n_results=n_results
        )

        output = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
            for d, m in zip(docs, metas):
                output.append({"document": d, "metadata": m})

        return output

    def query_policy_documents(
        self,
        store: str,
        query: str,
        n_results: int = 3
    ) -> List[Dict[str, Any]]:
        try:
            collection = self.client.get_collection(name="global_store_policies")
        except Exception:
            return []

        query_emb = self._generate_embedding(query)
        results = collection.query(
            query_embeddings=[query_emb],
            where={"store": store},
            n_results=n_results
        )

        output = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
            for d, m in zip(docs, metas):
                output.append({"document": d, "metadata": m})

        return output

chroma_service = ChromaService()
