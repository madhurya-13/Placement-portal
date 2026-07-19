# app/api/v1/students.py
"""Student profile endpoints — accessible only to the STUDENT role."""

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.student import StudentProfileCreate, StudentProfileUpdate, StudentProfileResponse
from app.services import student_service
from app.core.dependencies import get_current_user, require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/me", response_model=StudentProfileResponse)
def get_my_profile(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db),
):
    return student_service.get_profile(db, current_user)


@router.post("/me", response_model=StudentProfileResponse, status_code=201)
def create_my_profile(
    payload: StudentProfileCreate,
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db),
):
    return student_service.create_profile(db, current_user, payload)


@router.put("/me", response_model=StudentProfileResponse)
def update_my_profile(
    payload: StudentProfileUpdate,
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db),
):
    return student_service.update_profile(db, current_user, payload)


@router.post("/me/resume", response_model=StudentProfileResponse)
def upload_my_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db),
):
    return student_service.upload_student_resume(db, current_user, file)