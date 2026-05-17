import os
from dotenv import load_dotenv, find_dotenv

# Load environment variables FIRST before any other imports
dotenv_path = find_dotenv()
load_dotenv(dotenv_path, override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app import models
from app.api import tickets, chat, analytics, auth, news

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VeriNews AI - Fake News Detection")

# Configure CORS
# Set FRONTEND_URL env var on Render to your Vercel URL e.g. https://verinews.vercel.app
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(chat.router)
app.include_router(analytics.router)
app.include_router(news.router)

@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Welcome to VeriNews AI"}

@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "ok"}
