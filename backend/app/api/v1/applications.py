# app/api/v1/applications.py
"""Application endpoints: students apply/track; recruiters view/shortlist applicants."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.schemas.applicant import ApplicantResponse, ApplicationStatusUpdate
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


@router.get("/job/{job_id}", response_model=list[ApplicantResponse])
def get_applicants(
    job_id: int,
    current_user: User = Depends(require_role(UserRole.RECRUITER, UserRole.PLACEMENT_OFFICER)),
    db: Session = Depends(get_db),
):
    is_officer = current_user.role == UserRole.PLACEMENT_OFFICER
    return application_service.get_applicants_for_job(db, current_user, job_id, is_officer=is_officer)


@router.put("/{application_id}/status", response_model=ApplicantResponse)
def update_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    current_user: User = Depends(require_role(UserRole.RECRUITER, UserRole.PLACEMENT_OFFICER)),
    db: Session = Depends(get_db),
):
    is_officer = current_user.role == UserRole.PLACEMENT_OFFICER
    return application_service.update_application_status(db, current_user, application_id, payload, is_officer=is_officer)