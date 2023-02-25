from enum import Enum


class AgentTool(str, Enum):
    GOOGLE_SEARCH = "google-search"
    GOOGLE_SERPER = "google-serper"
    LLM_MATH = "llm-math"
    NEWS_API = "news-api"
    OPEN_METEO_API = "open-meteo-api"
    PAL_COLORED_OBJECTS = "pal-colored-objects"
    PAL_MATH = "pal-math"
    PYTHON_REPL = "python_repl"
    REQUESTS = "requests"
    SEARX_SEARCH = "searx-search"
    SERPAPI = "serpapi"
    TERMINAL = "terminal"
    TMDB_API = "tmdb-api"
    WOLFRAM_ALPHA = "wolfram-alpha"


class Agent(str, Enum):
    CONVERSATIONAL_REACT_DESCRIPTION = "conversational-react-description"
    REACT_DOCSTORE = "react-docstore"
    SELF_ASK_WITH_SEARCH = "self-ask-with-search"
    ZERO_SHOT_REACT_DESCRIPTION = "zero-shot-react-description"
