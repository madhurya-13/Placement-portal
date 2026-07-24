"""add is_approved to users, approval_status to jobs

Revision ID: 47353cf6a43d
Revises: 76b45d937cfd
Create Date: 2026-07-23 10:54:04.349940

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '47353cf6a43d'
down_revision: Union[str, None] = '76b45d937cfd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Explicitly create the enum type first — Alembic's autogenerate
    # doesn't do this automatically for ADD COLUMN (only for CREATE TABLE).
    job_approval_status_enum = sa.Enum('pending', 'approved', 'rejected', name='jobapprovalstatus')
    job_approval_status_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
    'jobs',
        sa.Column('approval_status', job_approval_status_enum, nullable=False, server_default='pending'),
)
    op.add_column('users', sa.Column('is_approved', sa.Boolean(), nullable=False, server_default='true'))


def downgrade() -> None:
    op.drop_column('users', 'is_approved')
    op.drop_column('jobs', 'approval_status')
    sa.Enum(name='jobapprovalstatus').drop(op.get_bind(), checkfirst=True)
