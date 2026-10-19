# app/schemas/notification.py
"""
A notification shown behind the dashboard bell icon. Notifications are
DERIVED from live data (applications, job approvals, pending accounts)
rather than stored, so ids must be stable across fetches — the client
keys its read-state map on `id`.
"""

from datetime import datetime
from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: str  # stable key, e.g. "application:12:shortlisted"
    title: str
    body: str
    created_at: datetime
