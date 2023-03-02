from enum import Enum
from typing import List

from pydantic import BaseModel

from solidchain.schemas.embeddings import Embeddings
from solidchain.schemas.mixins.dates import TimestampMixin
from solidchain.schemas.storage import FileStorage


class VectorStoreDB(str, Enum):
    CHROMA = "chroma"
    ELASTIC_SEARCH = "elastic_search"
    FAISS = "faiss"
    MILVUS = "milvus"
    PINECONE = "pinecone"
    QDRANT = "qdrant"
    WEAVIATE = "weaviate"


# Shared properties
class VectorStoreBase(BaseModel):
    vectorstoreId: int
    # userId: int
    name: str
    description: str
    vectorDb: str
    embeddingsType: Embeddings
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
