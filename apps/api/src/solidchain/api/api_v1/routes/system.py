from typing import Any

from fastapi import APIRouter

from solidchain import schemas

router = APIRouter()


@router.get("/healthz", response_model=schemas.Ack)
def app_health() -> Any:
    return schemas.Ack(message="success")
