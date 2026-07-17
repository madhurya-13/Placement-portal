# app/models/__init__.py
"""
Central import point for all SQLAlchemy models.
Anything that needs Base.metadata to know about every table
(Alembic's autogenerate, or app startup) should import THIS
package, not individual model files directly.
"""

from app.models.user import User                     # noqa: F401
from app.models.student import Student                 # noqa: F401
from app.models.company import Company                 # noqa: F401
from app.models.job import Job                           # noqa: F401
from app.models.application import Application           # noqa: F401
from app.models.refresh_token import RefreshToken         # noqa: F401