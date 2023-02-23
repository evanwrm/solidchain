from enum import Enum


class SummarizeChainType(str, Enum):
    MAP_REDUCE = "map_reduce"
    REFINE = "refine"
    STUFF = "stuff"
