import subprocess
import sys
from importlib.metadata import version
from typing import Any

from fastapi import APIRouter

from solidchain.schemas.settings import GitConfig
from solidchain.schemas.settings import Settings as SettingsSchema
from solidchain.schemas.settings import Versions

router = APIRouter()


@router.get("/settings", response_model=SettingsSchema)
def findOne() -> Any:
    commit = (
        subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("utf-8").strip()
    )
    settings = SettingsSchema(
        gitConfig=GitConfig(commitHash=commit[0:8]),
        versions=Versions(
            pythonVersion=".".join([str(x) for x in sys.version_info[0:3]]),
            fastapiVersion=version("fastapi"),
            torchVersion=version("torch"),
            transformersVersion=version("transformers"),
            langchainVersion=version("langchain"),
        ),
    )

    return settings
