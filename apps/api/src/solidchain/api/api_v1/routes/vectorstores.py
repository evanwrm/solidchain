import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session

from solidchain.api.dependencies import get_db
from solidchain.models.storage import FileStorage
from solidchain.models.vectorstore import VectorStore
from solidchain.schemas.embeddings import Embeddings
from solidchain.schemas.vectorstore import VectorStore as VectorStoreSchema
from solidchain.schemas.vectorstore import VectorStoreDB
from solidchain.utils.embeddings import get_embeddings_instance
from solidchain.utils.encoding import serialize_response
from solidchain.utils.file_loaders import from_file, from_url
from solidchain.utils.utils import data_path
from solidchain.utils.vectorstores import (
    from_documents_save_local,
    get_vectorstore_instance,
)

router = APIRouter()


@router.get("", response_model=List[VectorStoreSchema])
async def findMany(
    *,
    db: Session = Depends(get_db),
) -> Any:
    query = db.query(VectorStore).order_by(VectorStore.createdAt.desc())

    # Encode and validate response
    return await serialize_response(
        query.all(),
        type=List[VectorStoreSchema],
    )


@router.get("/{vectorstoreId}", response_model=VectorStoreSchema)
async def findOne(
    *,
    db: Session = Depends(get_db),
    vectorstoreId: int,
) -> Any:
    query = db.query(VectorStore).filter(VectorStore.vectorstoreId == vectorstoreId)

    # Encode and validate response
    return await serialize_response(
        query.first(),
        type=VectorStoreSchema,
    )


@router.post("/create", response_model=VectorStoreSchema)
async def create(
    *,
    db: Session = Depends(get_db),
    name: str = Body(),
    description: str = Body(""),
    vectorDbType: VectorStoreDB = Body(VectorStoreDB.CHROMA),
    embeddingsType: Embeddings = Body(Embeddings.HUGGINGFACE_INSTRUCT),
    urls: List[str] = Body([]),
    files: List[UploadFile] = Body([]),
) -> Any:
    try:
        file_documents = [doc for file in files for doc in from_file(file)]
        url_documents = [doc for url in urls for doc in from_url(url)]

        embeddings_cls = get_embeddings_instance(embeddingsType)
        vectorstore_cls = get_vectorstore_instance(vectorDbType)
        index_directory = str(data_path() / f"preprocessed/{uuid.uuid4()}")
        from_documents_save_local(
            vectorstore_cls,
            file_documents + url_documents,
            embeddings_cls(),
            directory=index_directory,
        )
    except NotImplementedError:
        raise HTTPException(
            status_code=400, detail="VectorStore function not implemented"
        )
    except Exception as e:
        print("Internal server error: ", e)
        raise HTTPException(status_code=500, detail="Internal server error")

    # Create VectorStore
    vectorstore_entry = VectorStore(
        name=name,
        description=description,
        vectorDb=vectorDbType,
        embeddingsType=embeddingsType,
        urls=urls,
        files=[
            FileStorage(
                filename=file.filename,
                path=file.filename,
                provider="local",
                bucket=None,
            )
            for file in files
        ],
        index=FileStorage(
            filename=index_directory,
            path=index_directory,
            provider="local",
            bucket=None,
        ),
    )
    db.add(vectorstore_entry)
    db.commit()
    db.refresh(vectorstore_entry)

    # Encode and validate response
    return await serialize_response(
        vectorstore_entry,
        type=VectorStoreSchema,
    )


@router.delete("/{vectorstoreId}", response_model=VectorStoreSchema)
async def delete(
    *,
    db: Session = Depends(get_db),
    vectorstoreId: int,
) -> Any:
    existing_matrix = (
        db.query(VectorStore).filter(VectorStore.vectorstoreId == vectorstoreId).first()
    )
    db.delete(existing_matrix)
    db.commit()

    # Encode and validate response
    return await serialize_response(
        existing_matrix,
        type=VectorStoreSchema,
    )
