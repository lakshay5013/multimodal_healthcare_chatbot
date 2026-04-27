from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json

class VectorDB:
    def __init__(self, chunk_size=500, overlap=100):
        """
        Initialize Vector Database with FAISS and Sentence Transformers
        
        Args:
            chunk_size: Number of characters per chunk
            overlap: Number of overlapping characters between chunks
        """
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.IndexFlatL2(384)
        self.chunks = []  # Stores all text chunks
        self.chunk_metadata = []  # Stores metadata about chunks (source, index, etc)
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.embeddings = np.array([], dtype=np.float32).reshape(0, 384)

    def chunk_document(self, text, document_name=""):
        """
        Break a document into overlapping chunks for better context retrieval
        
        Args:
            text: The text to chunk
            document_name: Name/source of the document
            
        Returns:
            List of chunks with metadata
        """
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            chunk = text[start:end]
            
            # Store chunk with metadata
            chunk_data = {
                "text": chunk.strip(),
                "source": document_name,
                "start_pos": start,
                "end_pos": end
            }
            chunks.append(chunk_data)
            
            # Move start position (with overlap)
            start = end - self.overlap
        
        return chunks if chunks else [{"text": text.strip(), "source": document_name, "start_pos": 0, "end_pos": len(text)}]

    def add_documents(self, docs, doc_names=None):
        """
        Add documents to vector database with chunking and vectorization
        
        Args:
            docs: List of documents (can be long texts)
            doc_names: Optional list of document names for metadata
        """
        if doc_names is None:
            doc_names = [f"doc_{i}" for i in range(len(docs))]
        
        all_chunks = []
        
        # Chunk each document
        for doc, name in zip(docs, doc_names):
            chunks = self.chunk_document(doc, name)
            all_chunks.extend(chunks)
        
        # Extract just the text for embedding
        chunk_texts = [chunk["text"] for chunk in all_chunks]
        
        # Generate embeddings using sentence transformers
        print(f"🔄 Generating embeddings for {len(chunk_texts)} chunks...")
        embeddings = self.model.encode(chunk_texts, show_progress_bar=False)
        embeddings = np.array(embeddings).astype("float32")
        
        # Add to FAISS index
        if len(embeddings) > 0:
            self.index.add(embeddings)
            self.embeddings = np.vstack([self.embeddings, embeddings])
            self.chunks.extend(all_chunks)
            self.chunk_metadata.extend(all_chunks)
            print(f"✅ Added {len(all_chunks)} chunks to vector database")

    def search(self, query, k=3):
        """
        Search for relevant chunks using semantic similarity via FAISS
        
        Args:
            query: User's question or query
            k: Number of top chunks to retrieve
            
        Returns:
            Formatted string of relevant context
        """
        if len(self.chunks) == 0:
            return "No medical knowledge available. Please consult a healthcare professional."
        
        # Encode the query
        query_embedding = self.model.encode([query])
        query_vec = np.array(query_embedding).astype("float32")
        
        # Search in FAISS index
        k_search = min(k, len(self.chunks))
        distances, indices = self.index.search(query_vec, k_search)
        
        # Retrieve chunks and format with metadata
        results = []
        for idx in indices[0]:
            if idx < len(self.chunks):
                chunk = self.chunks[idx]
                result_text = chunk["text"]
                source = chunk.get("source", "Unknown")
                results.append(f"[Source: {source}] {result_text}")
        
        if not results:
            return "No relevant medical information found. Please consult a healthcare professional."
        
        return "\n\n".join(results)

    def get_stats(self):
        """Get statistics about the vector database"""
        return {
            "total_chunks": len(self.chunks),
            "embedding_dimension": 384,
            "index_size": len(self.embeddings),
            "chunk_size": self.chunk_size,
            "overlap": self.overlap
        }