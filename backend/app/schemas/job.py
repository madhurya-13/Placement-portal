# app/schemas/job.py
"""Schemas for job postings — students only ever read these, never write."""

from datetime import datetime
from pydantic import BaseModel


class CompanyBrief(BaseModel):
    """A trimmed-down company view, nested inside JobResponse."""
    id: int
    name: str
    logo_url: str | None

    model_config = {"from_attributes": True}


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    ctc: int | None
    eligibility_criteria: str | None
    deadline: datetime
    created_at: datetime
    company: CompanyBrief

    model_config = {"from_attributes": True}