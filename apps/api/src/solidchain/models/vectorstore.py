from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    Interval,
    String,
    Table,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship

from solidchain.database.base import Base
from solidchain.models.mixins.dates import TimestampMixin

vectorstore_filestorage_association = Table(
    "vectorstore_filestorage_association",
    Base.metadata,
    Column("vectorstoreId", ForeignKey("vectorstore.vectorstoreId"), primary_key=True),
    Column("fileId", ForeignKey("filestorage.fileId"), primary_key=True),
)


class VectorStore(Base, TimestampMixin):
    vectorstoreId = Column(Integer, primary_key=True, autoincrement=True)
    # userId = Column(Integer, ForeignKey("user.userId", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    vectorDb = Column(String, nullable=False)
    embeddingsType = Column(String, nullable=False)
    urls = Column(ARRAY(String))
    files = relationship(
        "FileStorage",
        secondary=vectorstore_filestorage_association,
        cascade="all, delete",
    )
    index_id = Column(
        UUID(as_uuid=True), ForeignKey("filestorage.fileId", ondelete="CASCADE")
    )
    index = relationship("FileStorage", uselist=False, cascade="all, delete")
