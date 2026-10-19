# app/api/v1/notifications.py
"""
Bell-icon notification feed. Derived per role on every call — see
notification_service for the id scheme the client keys read-state on.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.services.notification_service import build_notifications

router = APIRouter(tags=["notifications"])


@router.get("/notifications", response_model=list[NotificationOut])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Notifications for the logged-in user, scoped to their role."""
    return build_notifications(db, current_user)
