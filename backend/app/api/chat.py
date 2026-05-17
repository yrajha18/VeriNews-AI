from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List, Dict, Any
import os
import tempfile
from ..services.gemini_service import gemini_service
from ..database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .auth import get_current_user, require_role
from ..models import User, UserRole

# Optional Pinecone / document loader support
try:
    from langchain_community.document_loaders import PyPDFLoader, TextLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from ..services.pinecone_service import pinecone_service
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False
    class _FakePinecone:
        def is_ready(self): return False
    pinecone_service = _FakePinecone()

router = APIRouter(prefix="/chat", tags=["Chat & RAG"])

class ChatMessage(BaseModel):
    message: str
    user_id: str = "guest"
    history: List[Dict[str, str]] = []

@router.post("/ingest")
async def ingest_document(file: UploadFile = File(...), current_user: User = Depends(require_role([UserRole.admin]))):
    if not PINECONE_AVAILABLE or not pinecone_service.is_ready():
        raise HTTPException(status_code=503, detail="Document ingestion unavailable. Pinecone is not configured.")
    
    # Save uploaded file temporarily
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        if suffix.lower() == '.pdf':
            loader = PyPDFLoader(temp_path)
        else:
            loader = TextLoader(temp_path, encoding="utf-8")
        
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        # Add to vector store
        pinecone_service.vectorstore.add_documents(splits)
        return {"message": f"Successfully ingested {len(splits)} chunks from {file.filename}."}
    finally:
        os.remove(temp_path)

@router.post("/message")
async def chat_message(chat: ChatMessage, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not gemini_service.llm:
        raise HTTPException(status_code=503, detail="Gemini LLM is not configured.")

    # Simple RAG implementation
    context = ""
    if pinecone_service.is_ready():
        try:
            docs = pinecone_service.vectorstore.similarity_search(chat.message, k=3)
            context = "\n".join([doc.page_content for doc in docs])
        except Exception as e:
            print(f"Pinecone search error: {e}")

    history_text = "\n".join([f"{msg.get('role', 'user')}: {msg.get('content', '')}" for msg in chat.history])

    prompt = f"""
    You are a helpful AI Support Desk assistant.
    IMPORTANT: First, detect the language of the User Query. You MUST respond in the EXACT SAME LANGUAGE as the user's query.
    
    Use the following knowledge base context to answer the user's query if it's relevant.
    If you cannot answer the user's question, politely offer to create a support ticket for them and instruct them to provide a title and description.
    
    Context:
    {context}
    
    Conversation History:
    {history_text}
    
    User Query: {chat.message}
    """
    
    try:
        response = gemini_service.llm.invoke(prompt)
        return {"reply": response.content}
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
