"""fix category unique constraint

Revision ID: 1c7266df9c60
Revises: 1a7bd2450171
Create Date: 2026-05-09 14:24:23.458048

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '1c7266df9c60'
down_revision: Union[str, Sequence[str], None] = '1a7bd2450171'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint(
        "uq_categories_user_id_name",
        "categories",
        type_="unique",
    )

    op.create_unique_constraint(
        "uq_categories_user_id_name_kind",
        "categories",
        ["user_id", "name", "kind"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        "uq_categories_user_id_name_kind",
        "categories",
        type_="unique",
    )

    op.create_unique_constraint(
        "uq_categories_user_id_name",
        "categories",
        ["user_id", "name"],
    )