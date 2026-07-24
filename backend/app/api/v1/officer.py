# app/api/v1/officer.py
"""Placement Officer endpoints — recruiter/job approval and platform stats."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.officer import PendingRecruiterResponse, JobApprovalUpdate, PlacementStats
from app.schemas.job import JobResponse
from app.services import officer_service
from app.core.dependencies import require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/officer", tags=["Placement Officer"])

# Every route here requires the PLACEMENT_OFFICER role — enforced once per route.
officer_only = Depends(require_role(UserRole.PLACEMENT_OFFICER))


@router.get("/recruiters/pending", response_model=list[PendingRecruiterResponse])
def pending_recruiters(current_user: User = officer_only, db: Session = Depends(get_db)):
    return officer_service.list_pending_recruiters(db)


@router.post("/recruiters/{recruiter_id}/approve", response_model=PendingRecruiterResponse)
def approve_recruiter(recruiter_id: int, current_user: User = officer_only, db: Session = Depends(get_db)):
    return officer_service.approve_recruiter(db, recruiter_id)


@router.post("/recruiters/{recruiter_id}/reject", status_code=204)
def reject_recruiter(recruiter_id: int, current_user: User = officer_only, db: Session = Depends(get_db)):
    officer_service.reject_recruiter(db, recruiter_id)


@router.get("/jobs/pending", response_model=list[JobResponse])
def pending_jobs(current_user: User = officer_only, db: Session = Depends(get_db)):
    return officer_service.list_pending_jobs(db)


@router.put("/jobs/{job_id}/approval", response_model=JobResponse)
def update_job_approval(
    job_id: int, payload: JobApprovalUpdate, current_user: User = officer_only, db: Session = Depends(get_db)
):
    return officer_service.update_job_approval(db, job_id, payload)


@router.get("/stats", response_model=PlacementStats)
def get_stats(current_user: User = officer_only, db: Session = Depends(get_db)):
    return officer_service.get_platform_stats(db)