# app/services/notification_service.py
"""
Builds the bell-icon notification feed for each role from live data.
Nothing is stored: every fetch recomputes the current state, and the
client tracks which stable ids it has already read (localStorage).

Id scheme (stable across fetches so read-state survives):
  application:{app_id}:{status}   — an application moved (or arrived)
  jobapproval:{job_id}:{status}   — a posting's approval outcome
  jobopen:{job_id}                — an approved opening for students
  pendingrecruiters:{count}       — officer's recruiter-approval queue
  pendingjobs:{count}             — officer's job-approval queue
"""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.models.job import Job, JobApprovalStatus
from app.models.student import Student
from app.models.user import User, UserRole

MAX_ITEMS = 20
STUDENT_OPEN_JOBS = 5  # how many recent approved jobs to surface as "openings"


def _iso(dt: datetime | None) -> datetime:
    return dt if dt is not None else datetime.now(timezone.utc)


def _student_notifications(db: Session, user: User) -> list[dict]:
    items: list[dict] = []

    # Application status movement (applied itself is not news).
    rows = (
        db.query(Application, Job)
        .join(Job, Application.job_id == Job.id)
        .filter(Application.status != ApplicationStatus.APPLIED)
        .order_by(Application.applied_at.desc())
        .limit(MAX_ITEMS)
        .all()
    )
    for app, job in rows:
        items.append(
            {
                "id": f"application:{app.id}:{app.status.value}",
                "title": "Application update",
                "body": f"Your application for '{job.title}' at "
                f"{job.company.name if job.company else 'the company'} is now "
                f"{app.status.value}.",
                "created_at": _iso(app.applied_at),
            }
        )

    # Recently approved openings the student can now apply to.
    open_jobs = (
        db.query(Job)
        .filter(Job.approval_status == JobApprovalStatus.APPROVED)
        .order_by(Job.created_at.desc())
        .limit(STUDENT_OPEN_JOBS)
        .all()
    )
    for job in open_jobs:
        items.append(
            {
                "id": f"jobopen:{job.id}",
                "title": "New opening",
                "body": f"'{job.title}' at "
                f"{job.company.name if job.company else 'a company'} "
                f"is open for applications.",
                "created_at": _iso(job.created_at),
            }
        )
    return items


def _recruiter_notifications(db: Session, user: User) -> list[dict]:
    items: list[dict] = []

    # Applications on this recruiter's own postings, at their current status.
    rows = (
        db.query(Application, Job, Student)
        .join(Job, Application.job_id == Job.id)
        .join(Student, Application.student_id == Student.id)
        .filter(Job.posted_by == user.id)
        .order_by(Application.applied_at.desc())
        .limit(MAX_ITEMS)
        .all()
    )
    for app, job, student in rows:
        who = student.full_name or "A student"
        if app.status == ApplicationStatus.APPLIED:
            title = "New application"
            body = f"{who} applied for '{job.title}'."
        else:
            title = "Applicant status update"
            body = f"{who} ('{job.title}') is now {app.status.value}."
        items.append(
            {
                "id": f"application:{app.id}:{app.status.value}",
                "title": title,
                "body": body,
                "created_at": _iso(app.applied_at),
            }
        )

    # Approval outcomes on this recruiter's postings.
    posted = (
        db.query(Job)
        .filter(
            Job.posted_by == user.id,
            Job.approval_status != JobApprovalStatus.PENDING,
        )
        .order_by(Job.created_at.desc())
        .limit(MAX_ITEMS)
        .all()
    )
    for job in posted:
        approved = job.approval_status == JobApprovalStatus.APPROVED
        items.append(
            {
                "id": f"jobapproval:{job.id}:{job.approval_status.value}",
                "title": "Posting approved" if approved else "Posting rejected",
                "body": f"'{job.title}' was {job.approval_status.value} by the "
                f"Placement Office"
                + ("." if approved else " — you can revise and repost."),
                "created_at": _iso(job.created_at),
            }
        )
    return items


def _officer_notifications(db: Session, user: User) -> list[dict]:
    items: list[dict] = []

    pending_recruiters = (
        db.query(User)
        .filter(User.role == UserRole.RECRUITER, User.is_approved == False)  # noqa: E712
        .all()
    )
    if pending_recruiters:
        latest = max((u.created_at for u in pending_recruiters), default=None)
        items.append(
            {
                "id": f"pendingrecruiters:{len(pending_recruiters)}",
                "title": "Recruiter approvals",
                "body": f"{len(pending_recruiters)} recruiter account(s) "
                f"awaiting your approval.",
                "created_at": _iso(latest),
            }
        )

    pending_jobs = (
        db.query(Job)
        .filter(Job.approval_status == JobApprovalStatus.PENDING)
        .all()
    )
    if pending_jobs:
        latest = max((j.created_at for j in pending_jobs), default=None)
        items.append(
            {
                "id": f"pendingjobs:{len(pending_jobs)}",
                "title": "Job approvals",
                "body": f"{len(pending_jobs)} job posting(s) awaiting your "
                f"approval.",
                "created_at": _iso(latest),
            }
        )
    return items


def build_notifications(db: Session, user: User) -> list[dict]:
    """Role-scoped notification feed, newest first, capped."""
    if user.role == UserRole.STUDENT:
        items = _student_notifications(db, user)
    elif user.role == UserRole.RECRUITER:
        items = _recruiter_notifications(db, user)
    elif user.role == UserRole.PLACEMENT_OFFICER:
        items = _officer_notifications(db, user)
    else:
        items = []

    items.sort(key=lambda n: n["created_at"], reverse=True)
    return items[:MAX_ITEMS]
