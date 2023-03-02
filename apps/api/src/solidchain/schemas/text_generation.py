from enum import Enum
from typing import Any, List

from pydantic import BaseModel


class CausalModel(str, Enum):
    GPT_3_5_TURBO = "gpt-3.5-turbo"
    TEXT_DAVINCI_003 = "text-davinci-003"
    TEXT_CURIE_001 = "text-curie-001"
    TEXT_BABBAGE_001 = "text-babbage-001"
    TEXT_ADA_001 = "text-ada-001"
    CODE_DAVINCI_002 = "code-davinci-002"
    CODE_CUSHMAN_001 = "code-cushman-001"


class CausalGeneration(BaseModel):
    text: str
    steps: List[Any] = []


class StreamingCausalGeneration(BaseModel):
    text: str
