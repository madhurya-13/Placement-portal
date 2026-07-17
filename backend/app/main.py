from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import app.models  # noqa: F401 — ensures all models are registered before anything else runs
from app.api.v1 import health, auth

app = FastAPI(
    title="Campus Placement Portal API",
    description="Backend API for managing campus placement drives.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")  # ADDED


@app.get("/")
def root():
    return {"message": "Campus Placement Portal API is running"}