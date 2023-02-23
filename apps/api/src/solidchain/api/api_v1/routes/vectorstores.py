from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from langchain.embeddings import OpenAIEmbeddings
from sqlalchemy.orm import Session

from solidchain.api.dependencies import get_db
from solidchain.models.storage import FileStorage
from solidchain.models.vectorstore import VectorStore
from solidchain.schemas.vectorstore import VectorStore as VectorStoreSchema
from solidchain.schemas.vectorstore import VectorStoreDB
from solidchain.utils.encoding import serialize_response
from solidchain.utils.file_loaders import from_file, from_url
from solidchain.utils.vectorstores import get_instance, save_index_local

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
    name: str,
    description: str = "",
    vectorDb: VectorStoreDB = VectorStoreDB.FAISS,
    urls: List[str] = [],
    files: List[UploadFile] = [],
) -> Any:
    try:
        file_documents = [doc for file in files for doc in from_file(file)]
        url_documents = [doc for url in urls for doc in from_url(url)]

        embeddings = OpenAIEmbeddings()
        vscls = get_instance(vectorDb)
        vectorstore = vscls.from_documents(file_documents + url_documents, embeddings)

        index_filename = save_index_local(vectorstore)
    except NotImplementedError:
        raise HTTPException(
            status_code=400, detail="VectorStore function not implemented"
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")

    # Create VectorStore
    vectorstore_entry = VectorStore(
        name=name,
        description=description,
        vectorDb=vectorDb,
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
            filename=index_filename,
            path=index_filename,
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
