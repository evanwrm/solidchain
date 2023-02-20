from typing import List

from pydantic import BaseModel

from solidchain.schemas.mixins.dates import TimestampMixin
from solidchain.schemas.storage import FileStorage


# Shared properties
class VectorStoreBase(BaseModel):
    vectorstoreId: int
    # userId: int
    name: str
    description: str
    vectorDb: str
    urls: List[str]
    files: List[FileStorage]
    index: FileStorage


# Properties shared by models stored in DB
class VectorStoreBaseInDBBase(VectorStoreBase, TimestampMixin):
    pass

    class Config:
        orm_mode = True


# Properties to return to client
class VectorStore(VectorStoreBaseInDBBase):
    pass


# Properties properties stored in DB
class VectorStoreBaseInDBBaseInDB(VectorStoreBaseInDBBase):
    pass
