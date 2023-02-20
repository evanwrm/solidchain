import { z } from "zod";
import { timestampValidator } from "~/lib/validators/Timestamp";

export const fileStorageValidator = z
    .object({
        fileId: z.string().uuid(),
        filename: z.string(),
        path: z.string(),
        provider: z.string(),
        bucket: z.string()
    })
    .merge(timestampValidator);
export type FileStorage = z.infer<typeof fileStorageValidator>;
