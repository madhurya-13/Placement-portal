# app/services/officer_service.py
"""
Business logic for Placement Officer oversight: approving recruiters
and jobs, and computing platform-wide statistics for the dashboard.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.models.job import Job, JobApprovalStatus
from app.models.company import Company
from app.models.application import Application, ApplicationStatus
from app.schemas.officer import JobApprovalUpdate


def list_pending_recruiters(db: Session) -> list[User]:
    """
    Pending = recruiter role, not yet approved, AND not already rejected
    (rejected accounts are deactivated via is_active=False, not deleted,
    so we must explicitly exclude them here or they'd appear stuck "pending" forever).
    """
    return (
        db.query(User)
        .filter(User.role == UserRole.RECRUITER, User.is_approved == False, User.is_active == True)  # noqa: E712
        .all()
    )



def approve_recruiter(db: Session, recruiter_id: int) -> User:
    recruiter = db.query(User).filter(User.id == recruiter_id, User.role == UserRole.RECRUITER).first()
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter not found.")
    recruiter.is_approved = True
    db.commit()
    db.refresh(recruiter)
    return recruiter


def reject_recruiter(db: Session, recruiter_id: int) -> None:
    """Rejecting deactivates the account rather than deleting it — preserves audit history."""
    recruiter = db.query(User).filter(User.id == recruiter_id, User.role == UserRole.RECRUITER).first()
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter not found.")
    recruiter.is_active = False
    db.commit()


def list_pending_jobs(db: Session) -> list[Job]:
    return db.query(Job).filter(Job.approval_status == JobApprovalStatus.PENDING).all()


def update_job_approval(db: Session, job_id: int, payload: JobApprovalUpdate) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    job.approval_status = payload.approval_status
    db.commit()
    db.refresh(job)
    return job


def get_platform_stats(db: Session) -> dict:
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    total_recruiters = db.query(User).filter(User.role == UserRole.RECRUITER).count()
    total_companies = db.query(Company).count()
    total_jobs = db.query(Job).count()
    pending_recruiters = db.query(User).filter(
        User.role == UserRole.RECRUITER, User.is_approved == False  # noqa: E712
    ).count()
    pending_jobs = db.query(Job).filter(Job.approval_status == JobApprovalStatus.PENDING).count()
    total_applications = db.query(Application).count()

    # Applications grouped by status, e.g. {"applied": 10, "shortlisted": 3, ...}
    status_counts = (
        db.query(Application.status, func.count(Application.id))
        .group_by(Application.status)
        .all()
    )
    applications_by_status = {status_val.value: count for status_val, count in status_counts}
    for s in ApplicationStatus:
        applications_by_status.setdefault(s.value, 0)

    # Top 5 companies by number of applications received across their jobs
    top_companies_raw = (
        db.query(Company.name, func.count(Application.id).label("app_count"))
        .join(Job, Job.company_id == Company.id)
        .join(Application, Application.job_id == Job.id)
        .group_by(Company.name)
        .order_by(func.count(Application.id).desc())
        .limit(5)
        .all()
    )
    top_companies_by_applications = [{"company": name, "applications": count} for name, count in top_companies_raw]

    selected_count = applications_by_status.get("selected", 0)
    placement_rate_percent = (
        round((selected_count / total_applications) * 100, 1) if total_applications > 0 else 0.0
    )

    return {
        "total_students": total_students,
        "total_recruiters": total_recruiters,
        "total_companies": total_companies,
        "total_jobs": total_jobs,
        "pending_recruiters": pending_recruiters,
        "pending_jobs": pending_jobs,
        "total_applications": total_applications,
        "applications_by_status": applications_by_status,
        "top_companies_by_applications": top_companies_by_applications,
        "placement_rate_percent": placement_rate_percent,
    }