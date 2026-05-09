"""update category unique constraint

Revision ID: 5b278d6a4e70
Revises: d43f4139978c
Create Date: 2026-05-09 14:14:50.239592

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b278d6a4e70'
down_revision: Union[str, Sequence[str], None] = 'd43f4139978c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
