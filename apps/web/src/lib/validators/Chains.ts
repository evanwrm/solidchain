import { z } from "zod";

export const summarizeChainTypeValidator = z.enum(["map_reduce", "refine", "stuff"]);
export type SummarizeChainType = z.infer<typeof summarizeChainTypeValidator>;
