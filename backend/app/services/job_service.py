# app/services/job_service.py
"""Job listing logic. Full CRUD for recruiters comes in a later milestone —
for now, students only need to browse open jobs."""

from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.job import Job


def list_open_jobs(db: Session) -> list[Job]:
    """Returns jobs whose deadline hasn't passed yet, newest first."""
    return (
        db.query(Job)
        .options(joinedload(Job.company))  # avoids N+1 queries for company data
        .filter(Job.deadline >= datetime.now(timezone.utc))
        .order_by(Job.created_at.desc())
        .all()
    )


def get_job_by_id(db: Session, job_id: int) -> Job:
    job = db.query(Job).options(joinedload(Job.company)).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    return job