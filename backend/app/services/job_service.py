# app/services/job_service.py
"""Job listing and management logic."""
from app.models.job import Job, JobApprovalStatus
from app.models.application import Application, ApplicationStatus
from datetime import datetime, timezone
from sqlalchemy import func
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


def get_recruiter_stats(db: Session, user: User) -> dict:
    """
    Placement statistics scoped to jobs this recruiter posted: how many
    applications came in, where they stand, and which of their companies
    attract the most applicants. Powers the recruiter dashboard graphs.
    """
    from app.models.company import Company

    job_ids = [jid for (jid,) in db.query(Job.id).filter(Job.posted_by == user.id).all()]

    total_jobs = len(job_ids)
    approved_jobs = pending_jobs = 0
    applications_by_status = {s.value: 0 for s in ApplicationStatus}
    total_applications = 0
    distinct_applicants = 0
    top_companies_by_applications: list[dict] = []

    if job_ids:
        approved_jobs = (
            db.query(Job)
            .filter(Job.posted_by == user.id, Job.approval_status == JobApprovalStatus.APPROVED)
            .count()
        )
        pending_jobs = (
            db.query(Job)
            .filter(Job.posted_by == user.id, Job.approval_status == JobApprovalStatus.PENDING)
            .count()
        )

        status_counts = (
            db.query(Application.status, func.count(Application.id))
            .filter(Application.job_id.in_(job_ids))
            .group_by(Application.status)
            .all()
        )
        for status_val, count in status_counts:
            applications_by_status[status_val.value] = count
        total_applications = sum(applications_by_status.values())

        distinct_applicants = (
            db.query(func.count(func.distinct(Application.student_id)))
            .filter(Application.job_id.in_(job_ids))
            .scalar()
            or 0
        )

        top_companies_raw = (
            db.query(Company.name, func.count(Application.id).label("app_count"))
            .join(Job, Job.company_id == Company.id)
            .join(Application, Application.job_id == Job.id)
            .filter(Job.posted_by == user.id)
            .group_by(Company.name)
            .order_by(func.count(Application.id).desc())
            .limit(5)
            .all()
        )
        top_companies_by_applications = [
            {"company": name, "applications": count} for name, count in top_companies_raw
        ]

    selected_count = applications_by_status.get("selected", 0)
    placement_rate_percent = (
        round((selected_count / total_applications) * 100, 1) if total_applications > 0 else 0.0
    )

    return {
        "total_jobs": total_jobs,
        "approved_jobs": approved_jobs,
        "pending_jobs": pending_jobs,
        "total_applications": total_applications,
        "distinct_applicants": distinct_applicants,
        "applications_by_status": applications_by_status,
        "top_companies_by_applications": top_companies_by_applications,
        "placement_rate_percent": placement_rate_percent,
    }