from enum import Enum


class SummarizeChainType(str, Enum):
    MAP_REDUCE = "map_reduce"
    MAP_RERANK = "map_rerank"
    REFINE = "refine"
    STUFF = "stuff"
