# app/api/v1/auth.py
"""
Authentication endpoints: register, login, refresh, logout, and 'who am I'.
Routes stay thin — all logic delegates to services/auth_service.py.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserRegister, UserResponse, UserLogin
from app.schemas.token import TokenResponse, RefreshRequest, AccessTokenResponse
from app.services import auth_service
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Creates a new user account. Role defaults to 'student' if not specified."""
    return auth_service.register_user(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Verifies credentials, returns an access token + refresh token pair."""
    user = auth_service.authenticate_user(db, payload.email, payload.password)
    return auth_service.issue_tokens(db, user)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    """Exchanges a valid refresh token for a new access token."""
    new_access_token = auth_service.refresh_access_token(db, payload.refresh_token)
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    """Revokes a refresh token — the associated access token remains
    valid until it naturally expires (max 60 minutes), but no new
    access tokens can be issued from this refresh token again."""
    auth_service.revoke_refresh_token(db, payload.refresh_token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the currently authenticated user's own profile."""
    return current_user