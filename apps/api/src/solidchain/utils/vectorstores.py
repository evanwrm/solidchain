import tempfile
from pathlib import Path
from urllib.parse import urlparse

import langchain.vectorstores as vectorstores
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.base import VectorStore

from solidchain.models.vectorstore import VectorStoreDB


def get_type(vectorstore: VectorStore):
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


def get_instance(vectorDb: VectorStoreDB):
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


def save_index(vectorstore: VectorStore) -> None:
    """Save index to filestorage"""
    with tempfile.TemporaryDirectory() as tmp:
        vectorstore.save_index(tmp)
        directory = tmp

    return directory
