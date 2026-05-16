from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas
from ..api.auth import get_current_user
from ..services.gemini_service import gemini_service
from ..services.cache_service import cache_service
import requests
from bs4 import BeautifulSoup

router = APIRouter(prefix="/news", tags=["news"])

def scrape_url(url: str) -> str:
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, "html.parser")
        # Remove script and style elements
        for element in soup(["script", "style"]):
            element.decompose()
        # Get text
        text = soup.get_text()
        # Break into lines and remove leading/trailing whitespace
        lines = (line.strip() for line in text.splitlines())
        # Break multi-headlines into a line each
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        # Drop blank lines
        text = "\n".join(chunk for chunk in chunks if chunk)
        return text[:5000] # Limit to first 5000 chars
    except Exception as e:
        print(f"Scraping error: {e}")
        return ""

@router.post("/verify", response_model=schemas.NewsVerifyResponse)
async def verify_news(
    request: schemas.NewsVerifyRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    content_to_analyze = request.content
    if request.type == "url":
        scraped_text = scrape_url(request.content)
        if scraped_text:
            content_to_analyze = f"URL: {request.content}\n\nContent: {scraped_text}"
    
    # 1. Check Global Cache first
    cached_analysis = cache_service.get_news_analysis(content_to_analyze)
    if cached_analysis:
        analysis = cached_analysis
    else:
        # 2. Call Gemini service if cache miss
        analysis = gemini_service.verify_news(content_to_analyze, request.type)
        # 3. Store result in cache for future users
        cache_service.set_news_analysis(content_to_analyze, analysis)
    
    # Save to DB
    new_verification = models.NewsVerification(
        user_id=current_user.id,
        content_type=request.type,
        input_data=request.content,
        prediction=analysis.prediction,
        confidence_score=analysis.confidence_score,
        explanation=analysis.explanation,
        sensationalism_score=analysis.sensationalism_score,
        bias_indicator=analysis.bias_indicator
    )
    db.add(new_verification)
    db.commit()
    db.refresh(new_verification)
    
    return new_verification

@router.get("/history", response_model=List[schemas.NewsVerifyResponse])
async def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    history = db.query(models.NewsVerification).filter(
        models.NewsVerification.user_id == current_user.id
    ).order_by(models.NewsVerification.created_at.desc()).all()
    return history
