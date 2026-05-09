from datetime import date as Date, timedelta
from typing import Literal


def build_period_range(
    period: Literal["day", "month", "year"],
    date: Date | None = None,
    month: int | None = None,
    year: int | None = None,
) -> tuple[Date, Date]:
    """Return (start_date, end_date) where end_date is exclusive."""
    if period == "day":
        assert date is not None
        return date, date + timedelta(days=1)

    if period == "month":
        assert month is not None and year is not None
        start = Date(year, month, 1)
        end = Date(year + 1, 1, 1) if month == 12 else Date(year, month + 1, 1)
        return start, end

    # period == "year"
    assert year is not None
    return Date(year, 1, 1), Date(year + 1, 1, 1)