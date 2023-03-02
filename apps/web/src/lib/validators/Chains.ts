import { z } from "zod";

export const summarizeChainTypeValidator = z.enum(["map_reduce", "map_rerank", "refine", "stuff"]);
export type SummarizeChainType = z.infer<typeof summarizeChainTypeValidator>;
