# app/models/company.py
"""
Company — created and managed by a Recruiter. Placement Officers can
see/manage all companies; Recruiters only see/manage their own.
"""

from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    website: Mapped[str] = mapped_column(String(300), nullable=True)
    logo_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # The recruiter who created this company record. Nullable + SET NULL
    # (not CASCADE) because if that recruiter's account is later removed,
    # the company and its job history are still valid data worth keeping.
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    jobs: Mapped[list["Job"]] = relationship(back_populates="company", cascade="all, delete-orphan")