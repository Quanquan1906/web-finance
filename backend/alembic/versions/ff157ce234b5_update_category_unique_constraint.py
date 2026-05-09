"""update category unique constraint

Revision ID: ff157ce234b5
Revises: 5b278d6a4e70
Create Date: 2026-05-09 14:18:03.280376

"""
from typing import Sequence, Union

from alembic import op


revision: str = "ff157ce234b5"
down_revision: Union[str, Sequence[str], None] = "5b278d6a4e70"
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