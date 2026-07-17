# app/models/job.py
"""
Job posting — the central entity students browse and apply to.
Belongs to a Company, created by an admin User (posted_by).
"""

from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    posted_by: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    ctc: Mapped[int] = mapped_column(Integer, nullable=True)  # Annual CTC in a single currency unit (e.g. INR/year)
    eligibility_criteria: Mapped[str] = mapped_column(Text, nullable=True)
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    company: Mapped["Company"] = relationship(back_populates="jobs")
    posted_by_user: Mapped["User"] = relationship(back_populates="posted_jobs")

    # One-to-many: a job can receive many applications.
    applications: Mapped[list["Application"]] = relationship(back_populates="job", cascade="all, delete-orphan")