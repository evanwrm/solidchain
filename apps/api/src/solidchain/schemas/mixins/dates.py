from datetime import datetime

from pydantic import BaseModel


class TimestampMixin(BaseModel):
    createdAt: datetime
    updatedAt: datetime
