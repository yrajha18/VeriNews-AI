from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Ticket, TicketPriority
from ..schemas import TicketCreate, TicketResponse
from ..services.gemini_service import gemini_service
from .auth import get_current_user, require_role
from ..models import User, UserRole

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Create DB model
    db_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        customer_email=ticket.customer_email,
        customer_id=current_user.id if current_user else None
    )
    
    # Auto-analyze using Gemini
    analysis = gemini_service.analyze_ticket(ticket.title, ticket.description)
    
    db_ticket.sentiment = analysis.sentiment
    try:
        db_ticket.priority = TicketPriority[analysis.priority]
    except KeyError:
        db_ticket.priority = TicketPriority.medium
        
    # We could also save the draft reply somewhere, maybe a new column or a comment model
        
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Note: in a real app we might return the draft reply as well.
    return db_ticket

@router.get("/", response_model=List[TicketResponse])
def get_tickets(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.agent, UserRole.admin]))
):
    return db.query(Ticket).order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()
