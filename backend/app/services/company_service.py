# app/services/company_service.py
"""Business logic for company management by recruiters."""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.company import Company
from app.models.user import User
from app.schemas.company import CompanyCreate


def create_company(db: Session, user: User, payload: CompanyCreate) -> Company:
    company = Company(**payload.model_dump(), created_by=user.id)
    db.add(company)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A company with this name already exists.")
    db.refresh(company)
    return company


def list_my_companies(db: Session, user: User) -> list[Company]:
    return db.query(Company).filter(Company.created_by == user.id).all()