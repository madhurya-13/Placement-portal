# app/services/job_service.py
"""Job listing and management logic."""
from app.models.job import Job, JobApprovalStatus
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.job import Job
from app.models.company import Company
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate


def list_open_jobs(db: Session) -> list[Job]:
    """Students only ever see jobs that are both non-expired AND approved."""
    return (
        db.query(Job)
        .options(joinedload(Job.company))
        .filter(
            Job.deadline >= datetime.now(timezone.utc),
            Job.approval_status == JobApprovalStatus.APPROVED,
        )
        .order_by(Job.created_at.desc())
        .all()
    )


def get_job_by_id(db: Session, job_id: int) -> Job:
    job = db.query(Job).options(joinedload(Job.company)).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    return job


def list_my_posted_jobs(db: Session, user: User) -> list[Job]:
    """Recruiter-facing: every job this recruiter has posted, expired or not."""
    return (
        db.query(Job)
        .options(joinedload(Job.company))
        .filter(Job.posted_by == user.id)
        .order_by(Job.created_at.desc())
        .all()
    )


def create_job(db: Session, user: User, payload: JobCreate) -> Job:
    company = db.query(Company).filter(Company.id == payload.company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found.")

    job = Job(**payload.model_dump(), posted_by=user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def _get_owned_job_or_404(db: Session, user: User, job_id: int) -> Job:
    """
    Shared ownership check for update/delete: a recruiter may only modify
    jobs they personally posted. Placement Officers bypass this check
    entirely (handled by the caller checking role before calling this).
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    if job.posted_by != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only modify jobs you posted.")
    return job


def update_job(db: Session, user: User, job_id: int, payload: JobUpdate, is_officer: bool = False) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first() if is_officer else _get_owned_job_or_404(db, user, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job


def delete_job(db: Session, user: User, job_id: int, is_officer: bool = False) -> None:
    job = db.query(Job).filter(Job.id == job_id).first() if is_officer else _get_owned_job_or_404(db, user, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    db.delete(job)
    db.commit()