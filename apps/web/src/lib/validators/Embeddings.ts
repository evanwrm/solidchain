import { z } from "zod";

export const embeddingsValidator = z.enum([
    "openai",
    "cohere",
    "huggingface",
    "tensorflow",
    "huggingface_instruct",
    "selfhost",
    "selfhost_huggingface",
    "selfhost_huggingface_instruct",
    "hypothetical_document"
]);
export type EmbeddingsType = z.infer<typeof embeddingsValidator>;
