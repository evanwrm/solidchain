from pydantic import BaseModel


class Versions(BaseModel):
    # python
    pythonVersion: str
    fastapiVersion: str
    torchVersion: str
    transformersVersion: str
    langchainVersion: str


# git
class GitConfig(BaseModel):
    commitHash: str


class Settings(BaseModel):
    gitConfig: GitConfig
    versions: Versions
