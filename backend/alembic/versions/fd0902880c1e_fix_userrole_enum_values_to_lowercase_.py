"""fix userrole enum values to lowercase student recruiter placement_officer

Revision ID: fd0902880c1e
Revises: 82181062ef65
Create Date: 2026-07-18 00:02:59.020149

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd0902880c1e'
down_revision: Union[str, None] = 'fef3a7635326'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Postgres doesn't allow renaming enum values in place easily, so we
    # create a new enum type, migrate the column over, then drop the old one.
    op.execute("ALTER TYPE userrole RENAME TO userrole_old")

    op.execute("CREATE TYPE userrole AS ENUM ('student', 'recruiter', 'placement_officer')")

    # Convert existing data: old ADMIN -> new placement_officer, STUDENT -> student
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN role DROP DEFAULT
    """)
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN role TYPE userrole
        USING (
            CASE role::text
                WHEN 'STUDENT' THEN 'student'
                WHEN 'ADMIN' THEN 'placement_officer'
                ELSE lower(role::text)
            END
        )::userrole
    """)
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN role SET DEFAULT 'student'
    """)

    op.execute("DROP TYPE userrole_old")


def downgrade() -> None:
    op.execute("ALTER TYPE userrole RENAME TO userrole_new")
    op.execute("CREATE TYPE userrole AS ENUM ('STUDENT', 'ADMIN')")
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN role TYPE userrole
        USING (
            CASE role::text
                WHEN 'student' THEN 'STUDENT'
                ELSE 'ADMIN'
            END
        )::userrole
    """)
    op.execute("DROP TYPE userrole_new")
