# app/models/user.py
"""
User model — the single authentication table for the entire app.
Every person who can log in (student, recruiter, or placement officer)
has exactly one row here. Role-specific data lives in separate tables.
"""

import enum
from datetime import datetime
from sqlalchemy import String, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class UserRole(str, enum.Enum):
    """
    Three roles reflect real placement-portal responsibilities:
    - STUDENT: browses jobs, applies, tracks their own applications
    - RECRUITER: represents a company, posts/manages jobs for that company
    - PLACEMENT_OFFICER: platform admin — manages companies, approves
      recruiters, oversees all applications across the college
    """
    STUDENT = "student"
    RECRUITER = "recruiter"
    PLACEMENT_OFFICER = "placement_officer"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
    Enum(UserRole, values_callable=lambda enum_cls: [e.value for e in enum_cls]),
    nullable=False,
    default=UserRole.STUDENT,
)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student_profile: Mapped["Student"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    posted_jobs: Mapped[list["Job"]] = relationship(back_populates="posted_by_user")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )