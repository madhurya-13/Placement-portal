# app/schemas/company.py
"""Schemas for company creation and responses."""

from pydantic import BaseModel, Field


class CompanyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None
    website: str | None = None
    logo_url: str | None = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    description: str | None
    website: str | None
    logo_url: str | None

    model_config = {"from_attributes": True}