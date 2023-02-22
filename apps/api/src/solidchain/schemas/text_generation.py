from enum import Enum

from pydantic import BaseModel


class CausalModels(str, Enum):
    TEXT_DAVINCI_003 = "text-davinci-003"
    TEXT_CURIE_001 = "text-curie-001"
    TEXT_BABBAGE_001 = "text-babbage-001"
    TEXT_ADA_001 = "text-ada-001"


class CausalGeneration(BaseModel):
    content: str
