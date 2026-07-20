# app/api/v1/companies.py
"""Company management endpoints — Recruiters create companies; Placement Officers see all."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.company import CompanyCreate, CompanyResponse
from app.services import company_service
from app.core.dependencies import require_role
from app.models.user import User, UserRole

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(
    payload: CompanyCreate,
    current_user: User = Depends(require_role(UserRole.RECRUITER, UserRole.PLACEMENT_OFFICER)),
    db: Session = Depends(get_db),
):
    return company_service.create_company(db, current_user, payload)


@router.get("/mine", response_model=list[CompanyResponse])
def list_my_companies(
    current_user: User = Depends(require_role(UserRole.RECRUITER)),
    db: Session = Depends(get_db),
):
    return company_service.list_my_companies(db, current_user)