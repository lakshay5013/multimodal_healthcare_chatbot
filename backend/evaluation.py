import os
import sys
import json
import numpy as np

# Add parent directory to path to import backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.vector_store import VectorDB

def load_data():
    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "scraped_medical_data.json")
    try:
        with open(data_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

def evaluate_retrieval(vector_db, test_data, k=3):
    """
    Evaluates the RAG retrieval system using Precision, Recall, and MRR.
    """
    if not test_data:
        print("No test data available for evaluation.")
        return

    # Generate test queries from the text itself
    queries = []
    expected_sources = []
    
    # We will pick a few distinct documents to test
    import random
    random.seed(42)
    sample_data = random.sample(test_data, min(50, len(test_data)))
    
    for item in sample_data:
        text = item["content"]
        words = text.split()
        if len(words) > 20:
            query = " ".join(words[5:20]) + "?" # Create a pseudo-query
            queries.append(query)
            expected_sources.append(item["title"])
            
    if not queries:
        print("Not enough data to form queries.")
        return

    print(f"Evaluating {len(queries)} test queries...")
    
    total_precision = 0.0
    total_recall = 0.0
    total_mrr = 0.0
    
    for query, expected_source in zip(queries, expected_sources):
        # Embed query
        query_embedding = vector_db.model.encode([query])
        query_vec = np.array(query_embedding).astype("float32")
        
        # Search FAISS index
        k_search = min(k, len(vector_db.chunks))
        distances, indices = vector_db.index.search(query_vec, k_search)
        
        # Collect sources of retrieved chunks
        retrieved_sources = []
        for idx in indices[0]:
            if idx < len(vector_db.chunks):
                chunk = vector_db.chunks[idx]
                retrieved_sources.append(chunk.get("source", "Unknown"))
                
        # Calculate boolean relevance array: 1 if relevant (matches source), 0 otherwise
        relevance = [1 if source == expected_source else 0 for source in retrieved_sources]
        
        # Precision@K: Proportion of retrieved documents that are relevant 
        precision = sum(relevance) / k_search if k_search > 0 else 0
        total_precision += precision
        
        # Recall@K: Proportion of total relevant documents retrieved.
        recall = 1 if sum(relevance) > 0 else 0
        total_recall += recall
        
        # MRR: Mean Reciprocal Rank
        mrr = 0
        for rank, is_rel in enumerate(relevance):
            if is_rel:
                mrr = 1.0 / (rank + 1)
                break
        total_mrr += mrr

    avg_precision = total_precision / len(queries)
    avg_recall = total_recall / len(queries)
    avg_mrr = total_mrr / len(queries)

    print("-" * 40)
    print("📉 Retrieval Evaluation Metrics 📉")
    print("-" * 40)
    print(f"Total Queries Evaluated : {len(queries)}")
    print(f"Top-K retrieved (K)     : {k}")
    print(f"✅ Precision@{k}          : {avg_precision:.4f}")
    print(f"✅ Recall@{k}             : {avg_recall:.4f}")
    print(f"✅ MRR@{k}                : {avg_mrr:.4f}")
    print("-" * 40)

if __name__ == "__main__":
    print("🚀 Initializing Vector DB for Evaluation...")
    vector_db = VectorDB(chunk_size=300, overlap=75)
    data = load_data()
    
    documents = [item["content"] for item in data]
    doc_names = [item["title"] for item in data]
    
    if documents:
        vector_db.add_documents(documents, doc_names)
        evaluate_retrieval(vector_db, data, k=3)
        evaluate_retrieval(vector_db, data, k=5)
    else:
        print("⚠️ No documents found to evaluate.")
