# app/models/application.py
"""
Application — the join table (with its own data) connecting Students to Jobs.
This is where the actual placement-tracking status lives.
"""

import enum
from datetime import datetime
from sqlalchemy import Enum, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    SELECTED = "selected"


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        # Prevents the same student from applying to the same job twice —
        # enforced by the database itself, not just application logic.
        UniqueConstraint("student_id", "job_id", name="uq_student_job_application"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus), nullable=False, default=ApplicationStatus.APPLIED
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["Student"] = relationship(back_populates="applications")
    job: Mapped["Job"] = relationship(back_populates="applications")