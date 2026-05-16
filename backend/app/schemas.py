from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import TicketPriority, TicketStatus, UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class GoogleLoginRequest(BaseModel):
    token: str

class TicketBase(BaseModel):
    title: str
    description: str
    customer_email: EmailStr

class TicketCreate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: int
    priority: TicketPriority
    status: TicketStatus
    sentiment: Optional[str] = None
    customer_id: Optional[int] = None
    assigned_agent_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NewsVerifyRequest(BaseModel):
    content: str
    type: str # text, headline, url

class NewsVerifyResponse(BaseModel):
    id: int
    prediction: str
    confidence_score: int
    explanation: str
    sensationalism_score: int
    bias_indicator: str
    created_at: datetime

    class Config:
        from_attributes = True
