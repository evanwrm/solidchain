import { z } from "zod";

export const apiSettingsValidator = z.object({
    gitConfig: z.object({
        commitHash: z.string()
    }),
    versions: z.object({
        pythonVersion: z.string(),
        fastapiVersion: z.string(),
        torchVersion: z.string(),
        transformersVersion: z.string(),
        langchainVersion: z.string()
    })
});
export type ApiSettings = z.infer<typeof apiSettingsValidator>;
