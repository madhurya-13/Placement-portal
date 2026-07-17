# app/db/session.py
"""
Database engine and session management.
`get_db()` is a FastAPI dependency — routes declare `db: Session = Depends(get_db)`
and receive a session that is automatically closed after the request finishes.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# The engine manages the actual connection pool to Postgres
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# SessionLocal is a factory that creates new DB session objects
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """
    Dependency-injected DB session.
    Ensures the session is always closed, even if an error occurs mid-request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()