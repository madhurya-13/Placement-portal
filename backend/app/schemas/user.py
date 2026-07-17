# app/schemas/user.py
"""
Pydantic schemas for user-related API requests/responses.
Never expose the User SQLAlchemy model directly in responses —
these schemas control exactly what fields the client sees.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Minimum 8 characters")
    role: UserRole = UserRole.STUDENT


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime

    # Allows Pydantic to read attributes directly off the SQLAlchemy
    # model instance (not just from a dict) — required for ORM objects.
    model_config = {"from_attributes": True}