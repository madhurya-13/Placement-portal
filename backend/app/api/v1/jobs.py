# app/api/v1/jobs.py
"""Job endpoints: students browse; recruiters manage their own postings."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.job import JobCreate, JobUpdate, JobResponse
from app.services import job_service
from app.core.dependencies import get_current_user, require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/", response_model=list[JobResponse])
def list_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Any authenticated user can browse currently-open jobs."""
    return job_service.list_open_jobs(db)


@router.get("/mine", response_model=list[JobResponse])
def list_my_jobs(
    current_user: User = Depends(require_role(UserRole.RECRUITER)),
    db: Session = Depends(get_db),
):
    """Recruiter-only: every job they've posted, including expired ones."""
    return job_service.list_my_posted_jobs(db, current_user)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return job_service.get_job_by_id(db, job_id)


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    current_user: User = Depends(require_role(UserRole.RECRUITER)),
    db: Session = Depends(get_db),
):
    return job_service.create_job(db, current_user, payload)


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    payload: JobUpdate,
    current_user: User = Depends(require_role(UserRole.RECRUITER, UserRole.PLACEMENT_OFFICER)),
    db: Session = Depends(get_db),
):
    is_officer = current_user.role == UserRole.PLACEMENT_OFFICER
    return job_service.update_job(db, current_user, job_id, payload, is_officer=is_officer)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    current_user: User = Depends(require_role(UserRole.RECRUITER, UserRole.PLACEMENT_OFFICER)),
    db: Session = Depends(get_db),
):
    is_officer = current_user.role == UserRole.PLACEMENT_OFFICER
    job_service.delete_job(db, current_user, job_id, is_officer=is_officer)