# app/models/user.py
"""
User model. Students and Placement Officers are auto-approved;
Recruiters must be approved by a Placement Officer before they
can post jobs (their jobs remain invisible to students until then).
"""

import enum
from datetime import datetime
from sqlalchemy import String, Enum, DateTime, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class UserRole(str, enum.Enum):
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
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # NEW: recruiters start unapproved; students/officers are auto-approved
    # at registration time (handled in auth_service, not here).
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student_profile: Mapped["Student"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    posted_jobs: Mapped[list["Job"]] = relationship(back_populates="posted_by_user")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )