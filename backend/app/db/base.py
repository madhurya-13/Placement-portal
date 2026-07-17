# app/db/base.py
"""
Declarative base class for all SQLAlchemy ORM models.
Every model in app/models/ will inherit from this Base.
Kept separate from session.py to avoid circular imports.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass