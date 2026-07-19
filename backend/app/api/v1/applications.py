# app/api/v1/applications.py
"""Application endpoints — students apply to jobs and track their status."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.services import application_service
from app.core.dependencies import require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply(
    payload: ApplicationCreate,
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db),
):
    return application_service.apply_to_job(db, current_user, payload.job_id)


@router.get("/me", response_model=list[ApplicationResponse])
def my_applications(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db),
):
    return application_service.get_my_applications(db, current_user)