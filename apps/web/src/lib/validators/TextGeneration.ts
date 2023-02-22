import { z } from "zod";

export const causalModelValidator = z.enum([
    "text-davinci-003",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001"
]);
export type CausalModel = z.infer<typeof causalModelValidator>;

export const causalGenerationValidator = z.object({
    content: z.string()
});
export type CausalGeneration = z.infer<typeof causalGenerationValidator>;
