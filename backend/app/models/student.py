# app/models/student.py
"""
Student profile — role-specific data for users with role=STUDENT.
Linked one-to-one with a User via user_id.
"""

from sqlalchemy import String, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    branch: Mapped[str] = mapped_column(String(100), nullable=False)
    batch_year: Mapped[int] = mapped_column(Integer, nullable=False)
    cgpa: Mapped[float] = mapped_column(Float, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)

    # Populated later via Cloudinary upload — nullable because a student
    # can create a profile before uploading a resume.
    resume_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Back-reference to the parent User row.
    user: Mapped["User"] = relationship(back_populates="student_profile")

    # One-to-many: a student can submit many applications.
    applications: Mapped[list["Application"]] = relationship(back_populates="student", cascade="all, delete-orphan")