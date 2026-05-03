from calendar import monthrange
from datetime import UTC, date, datetime, timedelta
from typing import Literal


DateRangePreset = Literal["current_month", "current_year", "last_15_days"]


def resolve_date_range(
    date_from: date | None,
    date_to: date | None,
    preset: DateRangePreset | None,
) -> tuple[date, date]:
    today = datetime.now(UTC).date()

    # Nếu user truyền cả 2 mốc thì ưu tiên dùng custom range
    if date_from and date_to:
        if date_from > date_to:
            raise ValueError("date_from cannot be greater than date_to")
        return date_from, date_to

    if preset == "current_year":
        return date(today.year, 1, 1), date(today.year, 12, 31)

    if preset == "last_15_days":
        return today - timedelta(days=14), today

    # default: current_month
    last_day = monthrange(today.year, today.month)[1]
    return date(today.year, today.month, 1), date(today.year, today.month, last_day)