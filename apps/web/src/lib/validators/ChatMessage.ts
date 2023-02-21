import { z } from "zod";
import { timestampValidator } from "~/lib/validators/Timestamp";

export const chatMessageValidator = z
    .object({
        content: z.string(),
        userId: z.string()
    })
    .merge(timestampValidator);
export type ChatMessage = z.infer<typeof chatMessageValidator>;
