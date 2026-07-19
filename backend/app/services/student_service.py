# app/services/student_service.py
"""Business logic for student profile management."""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile

from app.models.student import Student
from app.models.user import User
from app.schemas.student import StudentProfileCreate, StudentProfileUpdate
from app.services.upload_service import upload_resume


def get_profile(db: Session, user: User) -> Student:
    profile = db.query(Student).filter(Student.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found. Create one first.")
    return profile


def create_profile(db: Session, user: User, payload: StudentProfileCreate) -> Student:
    existing = db.query(Student).filter(Student.user_id == user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Profile already exists. Use update instead.")

    profile = Student(user_id=user.id, **payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(db: Session, user: User, payload: StudentProfileUpdate) -> Student:
    profile = get_profile(db, user)
    updates = payload.model_dump(exclude_unset=True)  # only fields actually sent
    for field, value in updates.items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


def upload_student_resume(db: Session, user: User, file: UploadFile) -> Student:
    profile = get_profile(db, user)
    profile.resume_url = upload_resume(file, profile.id)
    db.commit()
    db.refresh(profile)
    return profile