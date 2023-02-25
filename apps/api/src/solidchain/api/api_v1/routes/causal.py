from importlib.metadata import version
from typing import Any, List, Optional

from fastapi import APIRouter
from langchain import ConversationChain, OpenAI
from langchain.agents import initialize_agent, load_tools
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.chains.summarize import load_summarize_chain

from solidchain.configs.config import settings
from solidchain.schemas.agents import Agent, AgentTool
from solidchain.schemas.chains import SummarizeChainType
from solidchain.schemas.text_generation import CausalGeneration, CausalModel

router = APIRouter()


@router.post("/generate", response_model=CausalGeneration)
def generate(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        openai_api_key=settings.OPENAI_API_KEY,
    )

    output = llm(text)
    generation = CausalGeneration(
        text=output.strip(),
    )
    return generation


@router.post("/qa", response_model=CausalGeneration)
def generate(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
    agent: Optional[Agent] = "zero-shot-react-description",
    agentPath: Optional[str] = None,
    agentTools: Optional[List[AgentTool]] = ["serpapi", "llm-math"],
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
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
def generate(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
    chainType: SummarizeChainType = "stuff",
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        openai_api_key=settings.OPENAI_API_KEY,
    )
    chain = load_summarize_chain(llm=llm, chain_type=chainType)
    output = chain.run(text)

    generation = CausalGeneration(
        text=output.strip(),
    )
    return generation


@router.post("/conversational", response_model=CausalGeneration)
def generate(
    *,
    text: str,
    modelName: CausalModel = "text-curie-001",
    temperature: float = 0.7,
) -> Any:
    llm = OpenAI(
        model_name=modelName,
        temperature=temperature,
        openai_api_key=settings.OPENAI_API_KEY,
    )
    chain = ConversationChain(llm=llm, memory=ConversationBufferMemory())
    output = chain.run(text)

    generation = CausalGeneration(
        text=output.strip(),
    )
    return generation
