import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from solidchain.database.base import Base
from solidchain.models.mixins.dates import TimestampMixin


class FileStorage(Base, TimestampMixin):
    # store as a uuid, don't let users guess the next id
    fileId = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, nullable=False)
    path = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    bucket = Column(String)
