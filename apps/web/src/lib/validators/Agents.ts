import { z } from "zod";

export const agentToolsValidator = z.enum([
    "google-search",
    "google-serper",
    "llm-math",
    "news-api",
    "open-meteo-api",
    "pal-colored-objects",
    "pal-math",
    "python_repl",
    "requests",
    "searx-search",
    "serpapi",
    "terminal",
    "tmdb-api",
    "wolfram-alpha"
]);
export type AgentTool = z.infer<typeof agentToolsValidator>;

export const agentsValidator = z.enum([
    "conversational-react-description",
    "react-docstore",
    "self-ask-with-search",
    "zero-shot-react-description"
]);
export type Agent = z.infer<typeof agentsValidator>;
