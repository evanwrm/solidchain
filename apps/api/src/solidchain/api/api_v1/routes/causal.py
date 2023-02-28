from importlib.metadata import version
from typing import Any, List, Optional

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain import ConversationChain, OpenAI
from langchain.agents import initialize_agent, load_tools
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.chains.summarize import load_summarize_chain

from solidchain.configs.config import settings
from solidchain.schemas.agents import Agent, AgentTool
from solidchain.schemas.chains import SummarizeChainType
from solidchain.schemas.text_generation import (
    CausalGeneration,
    CausalModel,
    StreamingCausalGeneration,
)
from solidchain.utils.encoding import serialize_response

router = APIRouter()


@router.post("/generate", response_model=CausalGeneration)
def generate(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
    maxTokens: int = 1024,
    streaming: bool = False,
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        max_tokens=maxTokens,
        streaming=streaming,
        openai_api_key=settings.OPENAI_API_KEY,
    )

    if streaming:

        def streaming_response():
            for output in llm.stream(text):
                generation = StreamingCausalGeneration(
                    text=output["choices"][0]["text"]
                )
                yield generation.json()

        return StreamingResponse(streaming_response())
    else:
        output = llm(text)
        generation = CausalGeneration(
            text=output.strip(),
        )
        return generation


@router.post("/qa", response_model=CausalGeneration)
def qa(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
    maxTokens: int = 1024,
    agent: Optional[Agent] = "zero-shot-react-description",
    agentPath: Optional[str] = None,
    agentTools: Optional[List[AgentTool]] = ["serpapi", "llm-math"],
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        max_tokens=maxTokens,
        openai_api_key=settings.OPENAI_API_KEY,
    )

    if agent:
        tools = load_tools(
            agentTools, llm=llm, serpapi_api_key=settings.SERPAPI_API_KEY
        )
        llmAgent = initialize_agent(tools=tools, llm=llm, agent=agent, max_iterations=5)
        output = llmAgent.run(text)
    elif agentPath:
        tools = load_tools(
            agentTools, llm=llm, serpapi_api_key=settings.SERPAPI_API_KEY
        )
        llmAgent = initialize_agent(
            tools=tools, llm=llm, agent_path=agentPath, max_iterations=5
        )
        output = llmAgent.run(text)
    else:
        output = llm(text)

    generation = CausalGeneration(
        text=output.strip(),
    )
    return generation


@router.post("/summarize", response_model=CausalGeneration)
def summarize(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
    maxTokens: int = 1024,
    chainType: SummarizeChainType = "stuff",
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        max_tokens=maxTokens,
        openai_api_key=settings.OPENAI_API_KEY,
    )
    chain = load_summarize_chain(llm=llm, chain_type=chainType)
    output = chain.run(text)

    generation = CausalGeneration(
        text=output.strip(),
    )
    return generation


@router.post("/conversational", response_model=CausalGeneration)
def conversational(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
    maxTokens: int = 1024,
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        max_tokens=maxTokens,
        openai_api_key=settings.OPENAI_API_KEY,
    )
    chain = ConversationChain(llm=llm, memory=ConversationBufferMemory())
    output = chain.run(text)

    generation = CausalGeneration(
        text=output.strip(),
    )
    return generation
