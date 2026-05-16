from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Ticket, TicketPriority, TicketStatus, UserRole, User, NewsVerification
from .auth import require_role, get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_checks = db.query(NewsVerification).count()
    real_count = db.query(NewsVerification).filter(NewsVerification.prediction == "Real").count()
    fake_count = db.query(NewsVerification).filter(NewsVerification.prediction == "Fake").count()
    unverified_count = db.query(NewsVerification).filter(NewsVerification.prediction == "Unverified").count()
    
    avg_confidence = db.query(func.avg(NewsVerification.confidence_score)).scalar() or 0
    
    # Group by content type
    type_counts = db.query(NewsVerification.content_type, func.count(NewsVerification.id)).group_by(NewsVerification.content_type).all()
    type_stats = {t: count for t, count in type_counts}
    
    return {
        "total_checks": total_checks,
        "real_count": real_count,
        "fake_count": fake_count,
        "unverified_count": unverified_count,
        "avg_confidence": round(float(avg_confidence), 2),
        "type_stats": type_stats,
        "real_ratio": round(real_count / total_checks * 100, 2) if total_checks > 0 else 0,
        "fake_ratio": round(fake_count / total_checks * 100, 2) if total_checks > 0 else 0
    }
