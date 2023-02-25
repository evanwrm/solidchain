import { z } from "zod";

export const transcriptionModelValidator = z.enum([
    "tiny.en",
    "tiny",
    "base.en",
    "base",
    "small.en",
    "small",
    "medium.en",
    "medium",
    "large-v1",
    "large-v2",
    "large"
]);
export type TranscriptionModel = z.infer<typeof transcriptionModelValidator>;

export const audioTranscriptionValidator = z.object({
    text: z.string()
});
export type AudioTranscription = z.infer<typeof audioTranscriptionValidator>;
