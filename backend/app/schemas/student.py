# app/schemas/student.py
"""Schemas for student profile creation, updates, and API responses."""

from pydantic import BaseModel, Field


class StudentProfileCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    branch: str = Field(min_length=2, max_length=100)
    batch_year: int = Field(ge=2000, le=2100)
    cgpa: float = Field(ge=0, le=10)
    phone: str | None = None


class StudentProfileUpdate(BaseModel):
    # All fields optional — a PATCH-style update, only sent fields get changed.
    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    branch: str | None = Field(default=None, min_length=2, max_length=100)
    batch_year: int | None = Field(default=None, ge=2000, le=2100)
    cgpa: float | None = Field(default=None, ge=0, le=10)
    phone: str | None = None


class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    branch: str
    batch_year: int
    cgpa: float
    phone: str | None
    resume_url: str | None

    model_config = {"from_attributes": True}