# app/api/v1/jobs.py
"""Job browsing endpoints. Open to any authenticated user for now."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.job import JobResponse
from app.services import job_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/", response_model=list[JobResponse])
def list_jobs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return job_service.list_open_jobs(db)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return job_service.get_job_by_id(db, job_id)