# app/api/v1/health.py
"""
Health check endpoint.
Used to verify the API is running and (soon) that the DB is reachable.
Render's deployment health checks will hit this endpoint in production.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Returns API status and confirms the database connection is alive
    by running a trivial query.
    """
    db.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "service": "campus-placement-portal-api",
        "database": "connected",
    }