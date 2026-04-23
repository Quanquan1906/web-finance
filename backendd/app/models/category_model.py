from datetime import datetime

class CategoryDocument:
    user_id: str
    name: str
    name_normalized: str
    icon: str
    color: str
    is_default: bool
    created_at: datetime
    updated_at: datetime