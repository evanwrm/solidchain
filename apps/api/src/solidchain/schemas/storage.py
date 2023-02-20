from pydantic import BaseModel

from solidchain.schemas.mixins.dates import TimestampMixin


# Shared properties
class FileStorageBase(BaseModel):
    fileId: str
    filename = str
    path = str
    provider = str
    bucket = str


# Properties shared by models stored in DB
class FileStorageBaseInDBBase(FileStorageBase, TimestampMixin):
    pass

    class Config:
        orm_mode = True


# Properties to return to client
class FileStorage(FileStorageBaseInDBBase):
    pass


# Properties properties stored in DB
class FileStorageBaseInDBBaseInDB(FileStorageBaseInDBBase):
    pass
