from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    agent = "agent"
    customer = "customer"

class TicketPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class TicketStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True) # Null for Google users
    full_name = Column(String(255))
    role = Column(SAEnum(UserRole), default=UserRole.customer)
    google_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tickets_created = relationship("Ticket", back_populates="customer", foreign_keys="Ticket.customer_id")
    tickets_assigned = relationship("Ticket", back_populates="assigned_agent", foreign_keys="Ticket.assigned_agent_id")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    customer_email = Column(String(255), index=True)
    priority = Column(SAEnum(TicketPriority), default=TicketPriority.low)
    status = Column(SAEnum(TicketStatus), default=TicketStatus.open)
    sentiment = Column(String(50), nullable=True) 
    
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    customer = relationship("User", back_populates="tickets_created", foreign_keys=[customer_id])
    assigned_agent = relationship("User", back_populates="tickets_assigned", foreign_keys=[assigned_agent_id])

class NewsVerification(Base):
    __tablename__ = "news_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_type = Column(String(50)) # text, headline, url
    input_data = Column(Text)
    prediction = Column(String(50)) # Real, Fake, Unverified
    confidence_score = Column(Integer) # 0-100
    explanation = Column(Text)
    sensationalism_score = Column(Integer, default=0) # 0-100
    bias_indicator = Column(String(50), default="Unknown") # Left-leaning, Centrist, Right-leaning, Unbiased
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="verifications")

# Add relationship back to User
User.verifications = relationship("NewsVerification", back_populates="user")
