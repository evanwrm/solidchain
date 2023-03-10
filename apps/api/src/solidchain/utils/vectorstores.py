import tempfile
from typing import Any, List, Optional, Type
from urllib.parse import urlparse

import langchain.vectorstores as vectorstores
from langchain.docstore.document import Document
from langchain.embeddings.base import Embeddings
from langchain.vectorstores.base import VectorStore

from solidchain.schemas.vectorstore import VectorStoreDB


def infer_vectorstore_type(vectorstore: VectorStore) -> VectorStoreDB:
    match vectorstore:
        case isinstance(vectorstores.Chroma):
            vectorDb = VectorStoreDB.CHROMA
        case isinstance(vectorstores.ElasticVectorSearch):
            vectorDb = VectorStoreDB.ELASTIC_SEARCH
        case isinstance(vectorstores.FAISS):
            vectorDb = VectorStoreDB.FAISS
        case isinstance(vectorstores.Milvus):
            vectorDb = VectorStoreDB.MILVUS
        case isinstance(vectorstores.Pinecone):
            vectorDb = VectorStoreDB.PINECONE
        case isinstance(vectorstores.Qdrant):
            vectorDb = VectorStoreDB.QDRANT
        case isinstance(vectorstores.Weaviate):
            vectorDb = VectorStoreDB.WEAVIATE
        case _:
            raise NotImplementedError
    return vectorDb


def get_vectorstore_cls(vectorDb: VectorStoreDB) -> Type[VectorStore]:
    match vectorDb:
        case VectorStoreDB.CHROMA:
            vectorstore_cls = vectorstores.Chroma
        case VectorStoreDB.ELASTIC_SEARCH:
            vectorstore_cls = vectorstores.ElasticVectorSearch
        case VectorStoreDB.FAISS:
            vectorstore_cls = vectorstores.FAISS
        case VectorStoreDB.MILVUS:
            vectorstore_cls = vectorstores.Milvus
        case VectorStoreDB.PINECONE:
            vectorstore_cls = vectorstores.Pinecone
        case VectorStoreDB.QDRANT:
            vectorstore_cls = vectorstores.Qdrant
        case VectorStoreDB.WEAVIATE:
            vectorstore_cls = vectorstores.Weaviate
        case _:
            raise NotImplementedError
    return vectorstore_cls


def get_vectorstore_instance(
    vectorDb: VectorStoreDB,
    collection_name: str = "solidchain",
    embedding_function: Optional[Embeddings] = None,
    persist_directory: Optional[str] = None,
) -> VectorStore:
    match vectorDb:
        case VectorStoreDB.CHROMA:
            vectorstore_cls = vectorstores.Chroma(
                collection_name=collection_name,
                embedding_function=embedding_function,
                persist_directory=persist_directory,
            )
        case VectorStoreDB.ELASTIC_SEARCH:
            vectorstore_cls = vectorstores.ElasticVectorSearch(
                embedding_function=embedding_function.embed_query
            )
        case VectorStoreDB.FAISS:
            vectorstore_cls = vectorstores.FAISS(
                embedding_function=embedding_function.embed_query
            )
        case VectorStoreDB.MILVUS:
            vectorstore_cls = vectorstores.Milvus(
                collection_name=collection_name,
                embedding_function=embedding_function.embed_query,
            )
        case VectorStoreDB.PINECONE:
            vectorstore_cls = vectorstores.Pinecone(
                embedding_function=embedding_function.embed_query,
            )
        case VectorStoreDB.QDRANT:
            vectorstore_cls = vectorstores.Qdrant(
                collection_name=collection_name,
                embedding_function=embedding_function.embed_query,
            )
        case VectorStoreDB.WEAVIATE:
            vectorstore_cls = vectorstores.Weaviate()
        case _:
            raise NotImplementedError
    return vectorstore_cls


def from_documents_save_local(
    vectorDb: VectorStoreDB,
    documents: List[Document],
    embeddings: Embeddings,
    directory=None,
) -> VectorStore:
    if directory is None:
        temp_directory = tempfile.TemporaryDirectory()
        directory = temp_directory.name

    vectorstore_cls = get_vectorstore_cls(vectorDb)
    vectorstore = vectorstore_cls.from_documents(
        documents, embeddings, persist_directory=directory
    )
    save_index_local(vectorstore, directory)
    return vectorstore


def save_index_local(vectorstore: VectorStore, directory: str) -> bool:
    """Save index to filestorage"""
    try:
        vectorstore.save_local(directory)
        return True
    except Exception as e:
        return False
