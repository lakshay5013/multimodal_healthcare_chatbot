import sys
import os
import json
from dotenv import load_dotenv

# Add parent directory to sys.path to resolve 'backend' module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import your RAG components
from backend.rag import generate_answer, vector_db, generate_hypothetical_document
from groq import Groq

# Load environment variables
load_dotenv()

def run_evaluation():
    try:
        from ragas import evaluate
        from ragas.metrics import (
            faithfulness,
            answer_relevancy,
        )
        from langchain_groq import ChatGroq
        from langchain_huggingface import HuggingFaceEmbeddings
        from datasets import Dataset
    except ImportError:
        print("⚠️ Please install required evaluation libraries. Run this command:")
        print("pip install ragas langchain-groq langchain-huggingface datasets pandas sentence-transformers")
        return

    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        print("⚠️ GROQ_API_KEY environment variable not set. Please set it in your .env file.")
        return

    # Initialize the Judge LLM (using Groq since you already use it) and Embeddings (using HuggingFace)
    print("🤖 Initializing Ragas Judge models...")
    judge_llm = ChatGroq(model_name="llama-3.3-70b-versatile", api_key=groq_api_key)
    judge_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Sample dataset for evaluation
    # You can add more questions and expected ground truths here
    eval_data = [
        {
            "question": "What are the common symptoms of a cold?",
            "ground_truth": "Common symptoms of a cold include runny nose, sore throat, cough, congestion, slight body aches, and low-grade fever."
        },
        {
            "question": "What is diabetes?",
            "ground_truth": "Diabetes is a chronic disease that occurs when the pancreas does not produce enough insulin or when the body cannot effectively use the insulin it produces."
        }
    ]

    print("🔍 Starting RAG Evaluation...")
    
    questions = []
    answers = []
    contexts = []
    ground_truths = []

    # Standard Groq client for our actual pipeline
    client = Groq(api_key=groq_api_key)

    print(f"Testing {len(eval_data)} questions through your RAG pipeline...")
    for item in eval_data:
        q = item["question"]
        print(f"\nEvaluating: '{q}'")
        
        # 1. Get Answer from your RAG
        answer = generate_answer(q)
        
        # 2. Re-create the Context that your RAG used (HyDE + Vector Search)
        hypothetical_doc = generate_hypothetical_document(q, client)
        search_query = f"{q}\n\n{hypothetical_doc}" if hypothetical_doc else q
        
        # raw_context contains the \n\n delimited string of retrieved chunks
        raw_context = vector_db.search(search_query, k=3)
        
        # Ragas expects contexts as a list of strings
        context_list = raw_context.split("\n\n") if isinstance(raw_context, str) else []
        
        questions.append(q)
        answers.append(answer)
        contexts.append(context_list)
        ground_truths.append(item["ground_truth"])
        
    # Build Dataset for Ragas
    data_dict = {
        "question": questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths
    }
    
    dataset = Dataset.from_dict(data_dict)
    
    print("\n📊 Running Ragas metrics...")
    
    # Configure Ragas evaluation metrics
    # Note: Using contextual metrics without ground_truth is possible for faithfulness/answer_relevancy
    metrics = [
        faithfulness,      # Checks for hallucination (is answer based on context?)
        answer_relevancy,  # Checks if answer is to-the-point for the question
    ]
    
    # Run evaluation
    result = evaluate(
        dataset,
        metrics=metrics,
        llm=judge_llm,
        embeddings=judge_embeddings,
    )
    
    print("\n✅ Evaluation Results (Score ranges from 0 to 1):")
    print(result)
    
    # Save to CSV for reporting
    try:
        df = result.to_pandas()
        csv_path = os.path.join(os.path.dirname(__file__), "..", "rag_evaluation_results.csv")
        df.to_csv(csv_path, index=False)
        print(f"\n📁 Detailed results saved to: {csv_path}")
    except Exception as e:
        print(f"\n⚠️ Could not save CSV report: {e}")

if __name__ == "__main__":
    run_evaluation()
