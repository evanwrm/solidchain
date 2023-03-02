import { z } from "zod";
import { fileStorageValidator } from "~/lib/validators/FileStorage";
import { timestampValidator } from "~/lib/validators/Timestamp";
import { embeddingsValidator } from "./Embeddings";

export const vectorDbValidator = z.enum([
    "chroma",
    "elastic_search",
    "faiss",
    "milvus",
    "pinecone",
    "qdrant",
    "weaviate"
]);
export type VectorDbType = z.infer<typeof vectorDbValidator>;

export const vectorStoreValidator = z
    .object({
        vectorstoreId: z.number(),
        name: z.string(),
        description: z.string(),
        vectorDb: vectorDbValidator,
        embeddingsType: embeddingsValidator,
        files: z.array(fileStorageValidator),
        index: fileStorageValidator.nullish()
    })
    .merge(timestampValidator);
export type VectorStore = z.infer<typeof vectorStoreValidator>;
