from datetime import date

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.report_repository import ReportRepository


class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.report_repo = ReportRepository(db)

    def get_summary(
        self,
        current_user: User,
        date_from: date | None = None,
        date_to: date | None = None,
    ):
        return self.report_repo.get_summary(current_user.id, date_from=date_from, date_to=date_to)

    def get_expense_by_category(self, current_user: User, date_from: date | None = None, date_to: date | None = None):
        rows = self.report_repo.get_expense_by_category(current_user.id, date_from=date_from, date_to=date_to)
        return [
            {
                "category_id": str(row.id),
                "category_name": row.name,
                "total": row.total,
            }
            for row in rows
        ]
