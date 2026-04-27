# 🐰 Rabbit AI - Healthcare Assistant

A modern, intelligent healthcare assistant powered by RAG (Retrieval-Augmented Generation) and LLaMA3, featuring a stunning Next.js frontend and FastAPI backend.

## ✨ Features

- 🚀 **LLaMA3 Integration** - Local AI model for healthcare questions
- 🎯 **RAG Technology** - Retrieves relevant healthcare context before answering
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- ⚡ **Real-time Chat** - Instant responses with loading indicators
- 🛡️ **Healthcare Focused** - Emphasizes consulting healthcare professionals
- 📱 **Mobile Responsive** - Works great on all devices

## 📋 Prerequisites

Before you start, make sure you have:

1. **Python 3.9+** installed
2. **Node.js 18+** and **npm** installed
3. **Ollama** installed with LLaMA3 model

### Install Ollama & LLaMA3

1. Download Ollama from https://ollama.ai
2. Install it on your system
3. Run LLaMA3 in your terminal:
   ```bash
   ollama run llama3
   ```
   This will download and start the LLaMA3 model (first run takes a few minutes)

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
# Navigate to project root
cd "MINI PROJECT(Rabbit AI)"

# Install Python dependencies
pip install -r requirement.txt
```

### 2. Install Frontend Dependencies

```bash
# Navigate to frontend
cd frontend

# Install npm packages
npm install
```

### 3. Run the Project

**Terminal 1 - Backend (Root directory):**
```bash
python -m uvicorn backend.main:app --reload
```
Backend will run on: `http://127.0.0.1:8000`

**Terminal 2 - Frontend (frontend directory):**
```bash
npm run dev
```
Frontend will run on: `http://localhost:3000`

### 4. Open in Browser

Visit `http://localhost:3000` and start chatting!

## 📁 Project Structure

```
MINI PROJECT(Rabbit AI)/
├── backend/
│   ├── main.py           # FastAPI app & endpoints
│   ├── rag.py            # RAG logic for generating answers
│   ├── vector_store.py   # Vector database with FAISS & embeddings
│   └── __pycache__/
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Main chat interface
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── data/                 # Data files directory
├── requirement.txt       # Python dependencies
├── DockerFile           # Docker configuration
└── README.md            # This file
```

## 🔌 API Endpoints

### Health Check
```
GET http://127.0.0.1:8000/
```
Response: `{"status": "✅ Rabbit AI backend running", ...}`

### Interactive Health Check
```
GET http://127.0.0.1:8000/health
```
Response: `{"status": "healthy", "service": "Rabbit AI"}`

### Chat with AI
```
GET http://127.0.0.1:8000/chat?query=What+are+symptoms+of+flu?
```
Response: `{"response": "Flu symptoms include..."}`

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.9+
- **AI**: LLaMA3 (via Ollama), FAISS, Sentence Transformers
- **Styling**: Tailwind CSS with custom animations

## ⚠️ Important Notes

1. **Ollama Must Be Running**: The backend needs Ollama with LLaMA3 running locally
2. **First Load**: First API call may take a few seconds as the model processes
3. **Medical Disclaimer**: Always consult healthcare professionals for medical advice
4. **CORS Enabled**: Frontend communicates with backend on different ports via CORS

## 🐛 Troubleshooting

### Backend Connection Error
**Error**: `Failed to connect to backend. Make sure the Python server is running`
**Solution**: Ensure terminal 1 is running `python -m uvicorn backend.main:app --reload`

### Ollama Error
**Error**: `Connection refused to http://localhost:11434`
**Solution**: Start Ollama and run `ollama run llama3`

### Port Already in Use
**Solution**: Change the port by running:
```bash
# Backend on different port
python -m uvicorn backend.main:app --reload --port 8001

# Frontend on different port
npm run dev -- -p 3001
```

### Module Not Found
**Solution**: Make sure all dependencies are installed:
```bash
pip install -r requirement.txt
npm install
```

## 📦 Dependencies

### Python (Backend)
- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **sentence-transformers** - Text embeddings
- **faiss-cpu** - Vector similarity search
- **requests** - HTTP requests for Ollama

### Node.js (Frontend)
- **next** - React framework
- **react** - UI library
- **tailwindcss** - CSS framework
- **typescript** - Type safety

## 🎨 UI/UX Features

- ✨ Smooth animations and transitions
- 🌙 Dark mode optimized
- 📱 Fully responsive design
- ⚡ Loading indicators and feedback
- 💬 Real-time message updates
- 🎯 Quick prompt suggestions
- 🔔 Error handling with user-friendly messages

## 🚀 Performance Tips

1. **First-time Setup**: The first LLaMA3 model load takes ~30 seconds
2. **Response Times**: Subsequent queries are faster (typically 10-30s)
3. **Memory**: Requires ~8GB RAM for comfortable operation

## 📝 Example Queries

Try asking about:
- Symptoms: "What are the symptoms of flu?"
- Conditions: "How to manage diabetes?"
- Prevention: "What causes high blood pressure?"
- General: "When should I see a doctor?"

## 🤝 Contributing

Feel free to improve this project by:
1. Adding more healthcare knowledge to the RAG
2. Enhancing the UI
3. Improving error handling
4. Adding new features

## 📄 License

This project is open source and available under the MIT License.

## ⭐ Support

If you find this project helpful, please give it a star!

---

**Made with ❤️ for healthcare AI**

# healthcare-chatbot-latest
