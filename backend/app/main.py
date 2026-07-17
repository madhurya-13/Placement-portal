# app/main.py
"""
FastAPI application entrypoint.
Run with: uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import health

app = FastAPI(
    title="Campus Placement Portal API",
    description="Backend API for managing campus placement drives.",
    version="0.1.0",
)

# Allow the React frontend (running on a different port/origin) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers — every new feature adds one line here, not scattered logic
app.include_router(health.router, prefix="/api/v1")


@app.get("/")
def root():
    """Root endpoint — just confirms the API is reachable."""
    return {"message": "Campus Placement Portal API is running"}