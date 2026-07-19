# app/services/application_service.py
"""Business logic for students applying to jobs and viewing their status."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.application import Application
from app.models.student import Student
from app.models.job import Job
from app.models.user import User


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