from typing import List, Union

from pydantic import AnyHttpUrl, BaseSettings, validator


class Settings(BaseSettings):
    API_V1_PREFIX: str = "/api/v1"
    APP_NAME: str = "SolidChain"

    OPENAI_API_KEY: str

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:4173",
        "http://localhost:5173",
    ]  # TODO: change to real cors list

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [c.strip() for c in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
