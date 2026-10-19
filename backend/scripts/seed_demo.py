"""
Seed demo accounts and placement data for local development.

Creates (idempotently — existing rows are left alone):
  - officer.demo@campus.edu      Placement Officer      OfficerDemo123
  - recruiter.demo@campus.edu    Recruiter (approved)   RecruiterDemo123
  - pending.recruiter@campus.edu Recruiter (pending)    PendingDemo123
  - student.demo1..6@campus.edu  Students               StudentDemo123
        with completed profiles + resume_url so they can apply immediately
  - Companies "Nimbus Systems" and "Aurora Labs" owned by the demo recruiter
  - 4 jobs (3 approved → visible to students, 1 pending officer approval)
  - 12 applications spread across applied/shortlisted/selected/rejected
    so the recruiter dashboard graphs and placement-rate tile have data

Run from the repo root:
    cd backend && ./venv/Scripts/python.exe scripts/seed_demo.py
"""

import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Make `app.*` importable when run as a plain script from anywhere.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models.user import User, UserRole  # noqa: E402
from app.models.student import Student  # noqa: E402
from app.models.company import Company  # noqa: E402
from app.models.job import Job, JobApprovalStatus  # noqa: E402
from app.models.application import Application, ApplicationStatus  # noqa: E402

OFFICER = ("officer.demo@campus.edu", "OfficerDemo123")
RECRUITER = ("recruiter.demo@campus.edu", "RecruiterDemo123")
PENDING_RECRUITER = ("pending.recruiter@campus.edu", "PendingDemo123")
STUDENT_PASSWORD = "StudentDemo123"

STUDENTS = [
    ("student.demo1@campus.edu", "Aarav Kulkarni", "CSE", 2026, 8.7),
    ("student.demo2@campus.edu", "Riya Sen", "ECE", 2026, 8.2),
    ("student.demo3@campus.edu", "Miguel Fernandes", "CSE", 2027, 7.9),
    ("student.demo4@campus.edu", "Tanvi Iyer", "IT", 2026, 9.1),
    ("student.demo5@campus.edu", "Jonah Mathew", "ME", 2027, 7.4),
    ("student.demo6@campus.edu", "Sara Qureshi", "CSE", 2026, 8.5),
]


def get_or_create_user(db, email: str, role: UserRole, password: str) -> tuple[User, bool]:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user, False
    user = User(
        email=email,
        hashed_password=hash_password(password),
        role=role,
        is_active=True,
        # Recruiters self-register as pending; everyone else is approved.
        is_approved=role != UserRole.RECRUITER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user, True


def get_or_create_company(db, name: str, created_by: int) -> tuple[Company, bool]:
    company = db.query(Company).filter(Company.name == name).first()
    if company:
        return company, False
    company = Company(
        name=name,
        description=f"{name} — demo company seeded for local development.",
        website=f"https://{name.lower().replace(' ', '')}.example.com",
        created_by=created_by,
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company, True


def get_or_create_job(db, company_id: int, posted_by: int, title: str, description: str,
                      ctc: int, days_until_deadline: int, approval: JobApprovalStatus) -> tuple[Job, bool]:
    job = db.query(Job).filter(Job.posted_by == posted_by, Job.title == title).first()
    if job:
        return job, False
    job = Job(
        company_id=company_id,
        posted_by=posted_by,
        title=title,
        description=description,
        ctc=ctc,
        eligibility_criteria="CGPA >= 7.0, no active backlogs",
        deadline=datetime.now(timezone.utc) + timedelta(days=days_until_deadline),
        approval_status=approval,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job, True


def seed_applications(db, plan: dict[int, list[tuple[int, ApplicationStatus]]]) -> int:
    """plan: {job_id: [(student_user_id, status), ...]} — skips existing pairs."""
    created = 0
    for job_id, entries in plan.items():
        for user_id, status in entries:
            profile = db.query(Student).filter(Student.user_id == user_id).first()
            if not profile:
                continue
            exists = (
                db.query(Application)
                .filter(Application.student_id == profile.id, Application.job_id == job_id)
                .first()
            )
            if exists:
                continue
            db.add(Application(student_id=profile.id, job_id=job_id, status=status))
            created += 1
    db.commit()
    return created


def main() -> None:
    db = SessionLocal()
    created_counts = {"users": 0, "companies": 0, "jobs": 0, "applications": 0}
    try:
        _officer, created = get_or_create_user(
            db, OFFICER[0], UserRole.PLACEMENT_OFFICER, OFFICER[1]
        )
        created_counts["users"] += created

        recruiter, created = get_or_create_user(db, RECRUITER[0], UserRole.RECRUITER, RECRUITER[1])
        created_counts["users"] += created
        # The demo recruiter must be able to log in right away.
        recruiter.is_approved = True
        recruiter.is_active = True
        db.commit()

        pending, created = get_or_create_user(db, PENDING_RECRUITER[0], UserRole.RECRUITER, PENDING_RECRUITER[1])
        created_counts["users"] += created
        pending.is_approved = False
        pending.is_active = True
        db.commit()

        student_users = {}
        for i, (email, name, branch, batch, cgpa) in enumerate(STUDENTS, start=1):
            user, created = get_or_create_user(db, email, UserRole.STUDENT, STUDENT_PASSWORD)
            created_counts["users"] += created
            student_users[i] = user
            profile = db.query(Student).filter(Student.user_id == user.id).first()
            if not profile:
                db.add(
                    Student(
                        user_id=user.id,
                        full_name=name,
                        branch=branch,
                        batch_year=batch,
                        cgpa=cgpa,
                        phone=f"90000000{i:02d}",
                        # No resume_url: seeded students upload their own via the
                        # real Cloudinary flow (required before applying).
                    )
                )
                db.commit()

        # Clean up placeholder resume URLs from older seed runs — they 404 and
        # made the "View uploaded resume" link unopenable.
        db.query(Student).filter(
            Student.resume_url.like("https://resumes.example.com/%")  # noqa: E711
        ).update({Student.resume_url: None}, synchronize_session=False)
        db.commit()

        nimbus, created = get_or_create_company(db, "Nimbus Systems", recruiter.id)
        created_counts["companies"] += created
        aurora, created = get_or_create_company(db, "Aurora Labs", recruiter.id)
        created_counts["companies"] += created

        jobs = {}
        job_specs = [
            (nimbus.id, "Backend Engineer",
             "Build and scale the core API that powers the platform (FastAPI, Postgres).",
             1200000, 45, JobApprovalStatus.APPROVED),
            (nimbus.id, "Frontend Engineer",
             "Own the React + TypeScript dashboard experience end to end.",
             1000000, 60, JobApprovalStatus.APPROVED),
            (aurora.id, "Data Analyst",
             "Turn placement and application data into actionable reports.",
             900000, 30, JobApprovalStatus.APPROVED),
            (aurora.id, "DevOps Engineer",
             "Own CI/CD, containers and observability for the demo stack.",
             1100000, 75, JobApprovalStatus.PENDING),
        ]
        for company_id, title, desc, ctc, days, approval in job_specs:
            job, created = get_or_create_job(
                db,
                company_id=company_id,
                posted_by=recruiter.id,
                title=title,
                description=desc,
                ctc=ctc,
                days_until_deadline=days,
                approval=approval,
            )
            jobs[title] = job
            created_counts["jobs"] += created

        s = student_users
        plan = {
            jobs["Backend Engineer"].id: [
                (s[1].id, ApplicationStatus.SELECTED),
                (s[2].id, ApplicationStatus.SHORTLISTED),
                (s[3].id, ApplicationStatus.REJECTED),
                (s[4].id, ApplicationStatus.APPLIED),
                (s[5].id, ApplicationStatus.SHORTLISTED),
                (s[6].id, ApplicationStatus.SELECTED),
            ],
            jobs["Frontend Engineer"].id: [
                (s[1].id, ApplicationStatus.APPLIED),
                (s[2].id, ApplicationStatus.REJECTED),
                (s[3].id, ApplicationStatus.SHORTLISTED),
            ],
            jobs["Data Analyst"].id: [
                (s[2].id, ApplicationStatus.SELECTED),
                (s[4].id, ApplicationStatus.APPLIED),
                (s[5].id, ApplicationStatus.REJECTED),
            ],
        }
        created_counts["applications"] = seed_applications(db, plan)

        print("Seed complete:")
        for key, value in created_counts.items():
            print(f"  {key:<13} created: {value}")
        print("\nDemo logins:")
        print(f"  Officer    {OFFICER[0]:<28} {OFFICER[1]}")
        print(f"  Recruiter  {RECRUITER[0]:<28} {RECRUITER[1]}")
        print(f"  Pending    {PENDING_RECRUITER[0]:<28} {PENDING_RECRUITER[1]}")
        print(f"  Students   student.demo1..6@campus.edu   {STUDENT_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
