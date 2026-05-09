"""fix category unique constraint

Revision ID: 1a7bd2450171
Revises: 045b8c5f03de
Create Date: 2026-05-09 14:22:31.795003

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a7bd2450171'
down_revision: Union[str, Sequence[str], None] = '045b8c5f03de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
