import os

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from backend.rag import generate_answer, vector_db
from backend.risk_analyzer import analyze_risk
from backend.report_analyzer import analyze_report

app = FastAPI(title="Rabbit AI – Healthcare Assistant")

frontend_origin = os.getenv("FRONTEND_URL", "").strip()
extra_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]
allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if frontend_origin:
    allow_origins.append(frontend_origin)

allow_origins.extend(extra_origins)

allow_origin_regex = os.getenv("CORS_ORIGIN_REGEX") or None

# ✅ CORS Middleware (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "✅ Rabbit AI backend running",
        "version": "3.1.0",
        "model": "LLaMA 3.3 70B (via Groq) + RAG with Chunking & FAISS",
        "features": [
            "⚡ Groq API for lightning-fast inference",
            "Document Chunking (300 char chunks with 75 char overlap)",
            "FAISS Vector Search (384-dim embeddings)",
            "Healthcare Knowledge Base (7 comprehensive topics)",
            "Semantic Similarity Retrieval",
            "🔴 Risk Severity Scoring System",
            "📄 Health Report Analyzer (PDF)",
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "Rabbit AI"}

@app.get("/stats")
def stats():
    """Get vector database statistics including chunking info"""
    db_stats = vector_db.get_stats()
    return {
        "vectordb": db_stats,
        "chunking": {
            "chunk_size": db_stats["chunk_size"],
            "overlap": db_stats["overlap"],
            "total_chunks": db_stats["total_chunks"]
        },
        "embeddings": {
            "model": "all-MiniLM-L6-v2 (Sentence Transformers)",
            "dimension": db_stats["embedding_dimension"],
            "indexed_chunks": db_stats["index_size"]
        },
        "faiss": {
            "index_type": "IndexFlatL2 (L2 distance)",
            "retrieval_method": "Semantic similarity search",
            "top_k_retrieval": 3
        },
        "evaluation_metrics": {
            "top_k": 3,
            "precision": 0.5714,
            "recall": 0.8000,
            "mrr": 0.7810,
            "description": "Information retrieval metrics computed using the evaluation script."
        }
    }

@app.get("/chat")
def chat(query: str):
    try:
        if not query or len(query.strip()) == 0:
            return {"response": "Please provide a valid health-related question."}
        
        answer = generate_answer(query)
        
        # Risk severity scoring (post-processing — does NOT modify RAG logic)
        risk_data = analyze_risk(answer)
        
        return {
            "response": answer,
            "risk_level": risk_data["risk_level"],
            "suggested_action": risk_data["suggested_action"],
        }
    except Exception as e:
        return {
            "response": f"⚠️ Error: {str(e)}. Make sure Ollama is running with LLaMA3 model: `ollama run llama3`",
            "risk_level": "Low",
            "suggested_action": "Please try again.",
        }

@app.post("/analyze-report")
async def analyze_report_endpoint(file: UploadFile = File(...)):
    """
    Upload a PDF blood test report for analysis.
    Extracts medical parameters, compares with normal ranges,
    and generates an AI-powered explanation via Groq.
    """
    try:
        if not file.filename.lower().endswith(".pdf"):
            return {
                "error": "Please upload a PDF file.",
                "extracted_values": [],
                "abnormal_parameters": [],
                "summary": "",
            }
        
        file_bytes = await file.read()
        
        if len(file_bytes) == 0:
            return {
                "error": "The uploaded file is empty.",
                "extracted_values": [],
                "abnormal_parameters": [],
                "summary": "",
            }
        
        result = analyze_report(file_bytes)
        return result
    
    except Exception as e:
        return {
            "error": f"Failed to analyze report: {str(e)}",
            "extracted_values": [],
            "abnormal_parameters": [],
            "summary": "",
        }