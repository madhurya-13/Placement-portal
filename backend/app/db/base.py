# app/db/base.py
"""
Declarative base class for all SQLAlchemy ORM models.
This file ONLY defines Base — it must NOT import any model files,
or we create a circular import (models import Base from here, and
if this file also imports models, whichever loads first breaks).
Model registration for Alembic happens in app/models/__init__.py instead.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass