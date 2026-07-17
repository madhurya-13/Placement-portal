# app/db/base.py
"""
Declarative base + a central import point for all models.
Alembic's env.py imports THIS file (not individual model files) so that
every model gets registered against Base.metadata before autogenerate runs.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models here so Base.metadata knows about every table.
# This import block has no "logical" use elsewhere in the code —
# it exists purely so Alembic's autogenerate can discover these models.
from app.models.user import User          # noqa: E402, F401
from app.models.student import Student    # noqa: E402, F401
from app.models.company import Company    # noqa: E402, F401
from app.models.job import Job            # noqa: E402, F401
from app.models.application import Application  # noqa: E402, F401