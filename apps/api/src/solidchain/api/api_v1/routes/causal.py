from importlib.metadata import version
from typing import Any

from fastapi import APIRouter
from langchain import OpenAI

from solidchain.configs.config import settings
from solidchain.schemas.text_generation import CausalGeneration, CausalModels

router = APIRouter()


@router.post("/generate", response_model=CausalGeneration)
def generate(
    *,
    text: str,
    modelName: CausalModels = "text-curie-001",
    temperature: float = 0.7,
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        openai_api_key=settings.OPENAI_API_KEY,
    )

    output = llm(text).strip()
    generation = CausalGeneration(
        content=output,
    )

    return generation
