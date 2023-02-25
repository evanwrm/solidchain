import { z } from "zod";

export const causalModelValidator = z.enum([
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
