import os
from pinecone import Pinecone, ServerlessSpec
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore

class PineconeService:
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = os.getenv("PINECONE_INDEX", "support-knowledge-base")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        self.pc = None
        self.embeddings = None
        self.vectorstore = None

        if self.api_key and self.api_key != "your_pinecone_api_key_here":
            try:
                self.pc = Pinecone(api_key=self.api_key)
                if self.gemini_api_key and self.gemini_api_key != "your_gemini_api_key_here":
                    self.embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2", google_api_key=self.gemini_api_key)
                    self.vectorstore = PineconeVectorStore(index_name=self.index_name, embedding=self.embeddings, pinecone_api_key=self.api_key)
            except Exception as e:
                print(f"Failed to initialize Pinecone: {e}")

    def is_ready(self):
        return self.vectorstore is not None

pinecone_service = PineconeService()
