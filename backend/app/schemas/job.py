# app/schemas/job.py
"""Schemas for job postings."""

from datetime import datetime
from pydantic import BaseModel, Field


class CompanyBrief(BaseModel):
    id: int
    name: str
    logo_url: str | None

    model_config = {"from_attributes": True}


class JobCreate(BaseModel):
    company_id: int
    title: str = Field(min_length=2, max_length=200)
    description: str
    ctc: int | None = None
    eligibility_criteria: str | None = None
    deadline: datetime


class JobUpdate(BaseModel):
    # All optional — PATCH-style partial update
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    ctc: int | None = None
    eligibility_criteria: str | None = None
    deadline: datetime | None = None


class RecruiterStats(BaseModel):
    """Placement statistics scoped to the jobs a single recruiter posted —
    powers the graphs on the recruiter dashboard."""

    total_jobs: int
    approved_jobs: int
    pending_jobs: int
    total_applications: int
    distinct_applicants: int
    applications_by_status: dict[str, int]
    top_companies_by_applications: list[dict]
    placement_rate_percent: float


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    ctc: int | None
    eligibility_criteria: str | None
    deadline: datetime
    created_at: datetime
    company: CompanyBrief
    posted_by: int | None

    model_config = {"from_attributes": True}