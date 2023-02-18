from fastapi import APIRouter

from solidchain.api.api_v1.routes import system

api_router = APIRouter()

api_router.include_router(system.router, prefix="", tags=["system"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(login.router, tags=["login"])
