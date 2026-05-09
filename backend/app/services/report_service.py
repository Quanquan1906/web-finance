from datetime import date

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.report_repository import ReportRepository


class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.report_repo = ReportRepository(db)

    def get_current_balance(self, current_user: User):
        return self.report_repo.get_current_balance(current_user.id)

    def get_summary(
        self,
        current_user: User,
        date_from: date | None = None,
        date_to: date | None = None,
    ):
        return self.report_repo.get_summary(current_user.id, date_from=date_from, date_to=date_to)

    def get_expense_by_category(self, current_user: User, date_from: date | None = None, date_to: date | None = None):
        rows = self.report_repo.get_expense_by_category(current_user.id, date_from=date_from, date_to=date_to)
        return self._map_category_rows(rows)

    def get_total_by_category(
        self,
        current_user: User,
        tx_type: str,
        date_from: date | None = None,
        date_to: date | None = None,
    ):
        rows = self.report_repo.get_total_by_category(
            current_user.id,
            tx_type=tx_type,
            date_from=date_from,
            date_to=date_to,
        )
        return self._map_category_rows(rows)

    def _map_category_rows(self, rows):
        return [
            {
                "category_id": str(row.id),
                "category_name": row.name,
                "total": row.total,
            }
            for row in rows
        ]
