"""update category unique constraint

Revision ID: d43f4139978c
Revises: 5f6311e02458
Create Date: 2026-05-09 14:09:21.164030

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd43f4139978c'
down_revision: Union[str, Sequence[str], None] = '5f6311e02458'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
