# app/models/job.py
"""
Job posting. New postings start as PENDING and are invisible to students
until a Placement Officer approves them — mirrors real placement-cell
oversight of what companies are allowed to recruit on campus.
"""

import enum
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class JobApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    posted_by: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    ctc: Mapped[int] = mapped_column(Integer, nullable=True)
    eligibility_criteria: Mapped[str] = mapped_column(Text, nullable=True)
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # NEW
    approval_status: Mapped[JobApprovalStatus] = mapped_column(
        Enum(JobApprovalStatus, values_callable=lambda enum_cls: [e.value for e in enum_cls]),
        nullable=False,
        default=JobApprovalStatus.PENDING,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    company: Mapped["Company"] = relationship(back_populates="jobs")
    posted_by_user: Mapped["User"] = relationship(back_populates="posted_jobs")
    applications: Mapped[list["Application"]] = relationship(back_populates="job", cascade="all, delete-orphan")