# app/services/auth_service.py
"""
Business logic for registration, login, token refresh, and logout.
Kept separate from api/v1/auth.py so it's independently testable
and reusable (e.g., if we ever add a CLI admin-creation script).
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserRegister
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_refresh_token,
)
from app.core.config import settings


def register_user(db: Session, payload: UserRegister) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        # Deliberately vague error — never reveal whether the email
        # exists or the password was wrong. Prevents user-enumeration attacks.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )
    return user


def issue_tokens(db: Session, user: User) -> dict:
    """Creates a fresh access + refresh token pair, storing the refresh token."""
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})

    raw_refresh_token = generate_refresh_token()
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    db_refresh_token = RefreshToken(
        user_id=user.id,
        token=raw_refresh_token,
        expires_at=expires_at,
    )
    db.add(db_refresh_token)
    db.commit()

    return {"access_token": access_token, "refresh_token": raw_refresh_token, "token_type": "bearer"}


def refresh_access_token(db: Session, raw_refresh_token: str) -> str:
    """Validates a refresh token against the DB, issues a new access token."""
    db_token = db.query(RefreshToken).filter(RefreshToken.token == raw_refresh_token).first()

    if not db_token or db_token.revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token.")

    if db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has expired.")

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is inactive.")

    return create_access_token(data={"sub": str(user.id), "role": user.role.value})


def revoke_refresh_token(db: Session, raw_refresh_token: str) -> None:
    """Used on logout — marks the refresh token as revoked, not deleted (audit trail)."""
    db_token = db.query(RefreshToken).filter(RefreshToken.token == raw_refresh_token).first()
    if db_token:
        db_token.revoked = True
        db.commit()