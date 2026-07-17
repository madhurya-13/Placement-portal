# app/models/company.py
"""
Company — data-only records (no login capability, per our Milestone 0 decision).
Only Admin users create/manage these through the API.
"""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    website: Mapped[str] = mapped_column(String(300), nullable=True)
    logo_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # One-to-many: a company can have many job postings.
    jobs: Mapped[list["Job"]] = relationship(back_populates="company", cascade="all, delete-orphan")