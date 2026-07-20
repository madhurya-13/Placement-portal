# app/services/application_service.py
"""Business logic for applications: student-side apply/view, and
recruiter-side viewing applicants + updating their status."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.application import Application
from app.models.student import Student
from app.models.job import Job
from app.models.user import User
from app.schemas.applicant import ApplicationStatusUpdate


def apply_to_job(db: Session, user: User, job_id: int) -> Application:
    profile = db.query(Student).filter(Student.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Complete your profile before applying.")
    if not profile.resume_url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload a resume before applying.")

    application = Application(student_id=profile.id, job_id=job_id)
    db.add(application)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already applied to this job.")
    db.refresh(application)
    return application


def get_my_applications(db: Session, user: User) -> list[Application]:
    profile = db.query(Student).filter(Student.user_id == user.id).first()
    if not profile:
        return []
    return (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.company))
        .filter(Application.student_id == profile.id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_applicants_for_job(db: Session, user: User, job_id: int, is_officer: bool = False) -> list[Application]:
    """Recruiter-facing: all applications for a specific job, with student details."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    if not is_officer and job.posted_by != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only view applicants for jobs you posted.")

    return (
        db.query(Application)
        .options(joinedload(Application.student))
        .filter(Application.job_id == job_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def update_application_status(
    db: Session, user: User, application_id: int, payload: ApplicationStatusUpdate, is_officer: bool = False
) -> Application:
    application = (
        db.query(Application)
        .options(joinedload(Application.job), joinedload(Application.student))
        .filter(Application.id == application_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")
    if not is_officer and application.job.posted_by != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only manage applicants for jobs you posted.")

    application.status = payload.status
    db.commit()
    db.refresh(application)
    return application