from fastapi import APIRouter

from solidchain.api.api_v1.routes import causal, settings, system, vectorstores

api_router = APIRouter()

api_router.include_router(system.router, prefix="", tags=["system"])
api_router.include_router(settings.router, prefix="", tags=["settings"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(login.router, tags=["login"])
api_router.include_router(
    vectorstores.router, prefix="/vectorstores", tags=["vectorstores"]
)
api_router.include_router(causal.router, prefix="/causal", tags=["generate"])
