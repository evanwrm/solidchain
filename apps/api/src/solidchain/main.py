from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from solidchain.api.api_v1.router import api_router
from solidchain.configs.config import settings

app = FastAPI(
    title=settings.APP_NAME, openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_PREFIX)
