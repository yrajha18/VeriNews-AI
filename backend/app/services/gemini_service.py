import os
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
import json

class TicketAnalysis(BaseModel):
    sentiment: str = Field(description="The sentiment of the user message. One of: positive, neutral, negative")
    priority: str = Field(description="The priority of the ticket. One of: low, medium, high, urgent")
    draft_reply: str = Field(description="A suggested draft reply to the user from support.")

class NewsAnalysis(BaseModel):
    prediction: str = Field(description="The prediction for the news content. One of: Real, Fake, Unverified")
    confidence_score: int = Field(description="The confidence score as an integer from 0 to 100")
    explanation: str = Field(description="A brief explanation of why the news is classified as such.")
    sensationalism_score: int = Field(description="A score from 0 to 100 indicating the level of sensationalism or clickbait in the content.")
    bias_indicator: str = Field(description="The political or ideological bias of the content. One of: Left-leaning, Centrist, Right-leaning, Unbiased")

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.llm = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            # Using standard LLM
            self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=self.api_key)
            # Structured output LLMs
            self.structured_llm_ticket = self.llm.with_structured_output(TicketAnalysis)
            self.structured_llm_news = self.llm.with_structured_output(NewsAnalysis)

    def analyze_ticket(self, title: str, description: str) -> TicketAnalysis:
        if not self.llm:
            return TicketAnalysis(sentiment="neutral", priority="medium", draft_reply="Thank you for your message. We will look into this.")
        
        prompt = f"""
        Analyze the following support ticket.
        Title: {title}
        Description: {description}
        
        Determine the sentiment, assign a priority, and write a polite draft reply for the support team to use.
        """
        try:
            return self.structured_llm_ticket.invoke(prompt)
        except Exception as e:
            print(f"Error calling Gemini for ticket: {e}")
            return TicketAnalysis(sentiment="neutral", priority="medium", draft_reply="Thank you for your message.")

    def verify_news(self, content: str, content_type: str) -> NewsAnalysis:
        if not self.llm:
            return NewsAnalysis(prediction="Unverified", confidence_score=0, explanation="AI service not configured.", sensationalism_score=0, bias_indicator="Unknown")

        prompt = f"""
        You are an expert fact-checker. Analyze the following news {content_type} and determine if it is Real or Fake.
        
        {content_type.capitalize()}: {content}
        
        Provide a clear prediction, a confidence score (0-100), and a concise explanation based on known facts and patterns.
        Also, evaluate the content for sensationalism (0-100 score) and political or ideological bias (Left-leaning, Centrist, Right-leaning, Unbiased).
        If it's a URL, analyze the content if possible (I will provide text if available).
        """
        try:
            return self.structured_llm_news.invoke(prompt)
        except Exception as e:
            print(f"Error calling Gemini for news: {e}")
            return NewsAnalysis(prediction="Unverified", confidence_score=0, explanation="An error occurred during analysis.", sensationalism_score=0, bias_indicator="Unknown")

gemini_service = GeminiService()
