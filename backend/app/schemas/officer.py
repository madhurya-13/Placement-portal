# app/schemas/officer.py
"""Schemas for Placement Officer oversight: recruiter/job approval and stats."""

from datetime import datetime
from pydantic import BaseModel
from app.models.job import JobApprovalStatus


class PendingRecruiterResponse(BaseModel):
    id: int
    email: str
    is_approved: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class JobApprovalUpdate(BaseModel):
    approval_status: JobApprovalStatus


class PlacementStats(BaseModel):
    total_students: int
    total_recruiters: int
    total_companies: int
    total_jobs: int
    pending_recruiters: int
    pending_jobs: int
    total_applications: int
    applications_by_status: dict[str, int]
    top_companies_by_applications: list[dict]
    placement_rate_percent: float