import { z } from "zod";

export const timestampValidator = z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

export type Timestamp = z.infer<typeof timestampValidator>;
