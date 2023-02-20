from typing import Any

from fastapi.routing import serialize_response as _serialize_response
from fastapi.utils import create_response_field


async def serialize_response(response_content: Any, type: Any) -> Any:
    return await _serialize_response(
        field=create_response_field(name="customfield", type_=type),
        response_content=response_content,
    )
