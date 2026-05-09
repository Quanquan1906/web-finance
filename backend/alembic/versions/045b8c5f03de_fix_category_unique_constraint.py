"""fix category unique constraint

Revision ID: 045b8c5f03de
Revises: ff157ce234b5
Create Date: 2026-05-09 14:19:55.757168

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '045b8c5f03de'
down_revision: Union[str, Sequence[str], None] = 'ff157ce234b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
