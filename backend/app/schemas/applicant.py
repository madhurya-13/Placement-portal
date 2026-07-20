# app/schemas/applicant.py
"""
Schemas for the recruiter-side view of applications — i.e., 'who applied
to my job', showing student details rather than job details.
"""

from datetime import datetime
from pydantic import BaseModel
from app.models.application import ApplicationStatus


class ApplicantStudentBrief(BaseModel):
    id: int
    full_name: str
    branch: str
    batch_year: int
    cgpa: float
    resume_url: str | None

    model_config = {"from_attributes": True}


class ApplicantResponse(BaseModel):
    id: int  # application id
    status: ApplicationStatus
    applied_at: datetime
    student: ApplicantStudentBrief

    model_config = {"from_attributes": True}


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus