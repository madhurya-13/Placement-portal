# app/core/security.py
"""
Password hashing and JWT creation/verification utilities.
Nothing outside this file should import bcrypt or jose directly.
"""

import secrets
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from app.core.config import settings

# CryptContext handles bcrypt hashing + verification, with automatic
# handling of algorithm upgrades in the future if we ever change schemes.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plaintext password for storage. Never store raw passwords."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a login attempt's password against the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """
    Creates a short-lived JWT carrying claims like user id and role.
    `sub` (subject) is the JWT-standard field for "who this token is about".
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Verifies signature + expiry, returns claims if valid, None if not."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


def generate_refresh_token() -> str:
    """
    Generates a cryptographically random opaque string — NOT a JWT.
    Since we validate refresh tokens against the database anyway (for
    revocation support), there's no need for it to be self-describing
    like a JWT. A random token is simpler and equally secure here.
    """
    return secrets.token_urlsafe(64)