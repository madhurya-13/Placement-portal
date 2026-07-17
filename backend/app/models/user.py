# app/models/user.py
"""
User model — the single authentication table for the entire app.
Every person who can log in (student or admin) has exactly one row here.
Role-specific data lives in separate tables (see student.py) linked by user_id.
"""

import enum
from datetime import datetime
from sqlalchemy import String, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class UserRole(str, enum.Enum):
    """
    Restricts the `role` column to exactly these two values at the DB level.
    Using str + enum.Enum together lets FastAPI/Pydantic serialize this
    cleanly as a plain string in API responses.
    """
    STUDENT = "student"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # One-to-one: a student user has exactly one student profile.
    # uselist=False makes this a scalar relationship instead of a list.
    student_profile: Mapped["Student"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )

    # One-to-many: an admin user can post many jobs.
    posted_jobs: Mapped[list["Job"]] = relationship(back_populates="posted_by_user")