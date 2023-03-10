import { z } from "zod";

export const causalModelValidator = z.enum([
    // ChatGPT
    "gpt-3.5-turbo",
    // GPT-3
    "text-davinci-003",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
    // Codex
    "code-davinci-002",
    "code-cushman-001"
]);
export type CausalModel = z.infer<typeof causalModelValidator>;

export const causalGenerationValidator = z.object({
    text: z.string()
});
export type CausalGeneration = z.infer<typeof causalGenerationValidator>;

export const streamingCausalGenerationValidator = z.object({
    text: z.string()
});
export type StreamingCausalGeneration = z.infer<typeof streamingCausalGenerationValidator>;
