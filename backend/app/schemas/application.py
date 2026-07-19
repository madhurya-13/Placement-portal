# app/schemas/application.py
"""Schemas for student job applications."""

from datetime import datetime
from pydantic import BaseModel
from app.models.application import ApplicationStatus
from app.schemas.job import JobResponse


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    status: ApplicationStatus
    applied_at: datetime
    job: JobResponse  # nested, so the student sees job details without a second request

    model_config = {"from_attributes": True}