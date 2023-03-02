import { env } from "~/lib/env/client";
import { Agent, AgentTool } from "~/lib/validators/Agents";
import { AudioTranscription } from "~/lib/validators/audioTranscription";
import { SummarizeChainType } from "~/lib/validators/Chains";
import { EmbeddingsType } from "~/lib/validators/Embeddings";
import { ApiSettings } from "~/lib/validators/Settings";
import { CausalGeneration } from "~/lib/validators/TextGeneration";
import { VectorDbType, VectorStore } from "~/lib/validators/VectorStore";

interface ApiOptions {
    fetcher?: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
    streamCallback?: (
        streamResult: { value: Uint8Array | undefined; done: boolean },
        chunks: any[]
    ) => unknown[];
    options?: RequestInit;
}
export const api = async (
    resource: string,
    { fetcher = fetch, streamCallback, options = {} }: ApiOptions = {}
) => {
    const host = env.VITE_API_ENDPOINT;
    const res = await fetcher(`${host}/${resource}`, {
        method: "GET",
        ...options,
        headers: {
            Origin: env.VITE_SITE_NAME,
            ...(options.headers ?? {})
        }
    });
    const contentType = res.headers.get("Content-Type");
    if (streamCallback) {
        const reader = res.body?.getReader();
        if (reader) {
            const chunks: unknown[][] = [];
            while (true) {
                const { done, value } = await reader.read();
                const mappedValue = streamCallback({ value, done }, chunks.flat(2));
                if (mappedValue !== undefined) chunks.push(mappedValue);
                if (done) break;
            }
            return chunks.flat(2);
        }
    }
    return contentType?.includes("application/json") ? await res.json() : await res.text();
};

// Settings
export interface SettingsFindOneRequest {}
export const settingsFindOne = async (
    {}: SettingsFindOneRequest,
    apiOptions?: ApiOptions
): Promise<ApiSettings> => {
    const params = new URLSearchParams();
    return await api(`settings?${params.toString()}`, apiOptions);
};

// Vectorstores
export interface VectorstoreFindManyRequest {}
export const vectorstoreFindMany = async (
    {}: VectorstoreFindManyRequest,
    apiOptions?: ApiOptions
): Promise<VectorStore[]> => {
    const params = new URLSearchParams();
    return await api(`vectorstores?${params.toString()}`, apiOptions);
};
export interface VectorstoreFindOneRequest {
    vectorstoreId: string;
}
export const vectorstoreFindOne = async (
    { vectorstoreId }: VectorstoreFindOneRequest,
    apiOptions?: ApiOptions
): Promise<VectorStore> => {
    const params = new URLSearchParams();
    return await api(`vectorstores/${vectorstoreId}?${params.toString()}`, apiOptions);
};
export interface VectorstoreCreateRequest {
    name: string;
    description?: string;
    vectorDbType?: VectorDbType;
    embeddingsType?: EmbeddingsType;
    urls?: string[];
    files?: File[];
}
export const vectorstoreCreate = async (
    {
        name,
        description,
        vectorDbType,
        embeddingsType,
        urls = [],
        files = []
    }: VectorstoreCreateRequest,
    apiOptions?: ApiOptions
): Promise<VectorStore> => {
    const formData = new FormData();
    formData.append("name", name);
    if (description !== undefined) formData.append("description", description);
    if (vectorDbType !== undefined) formData.append("vectorDbType", vectorDbType);
    if (embeddingsType !== undefined) formData.append("embeddingsType", embeddingsType);
    for (const url of urls) formData.append("urls", url);
    for (const file of files) formData.append("files", file);

    return await api(`vectorstores/create`, {
        options: { method: "POST", body: formData },
        ...apiOptions
    });
};

// Generate
export interface CausalLMGenerateRequest {
    text: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    streaming?: boolean;
}
export const causalLMGenerate = async (
    { text, modelName, temperature, maxTokens, streaming }: CausalLMGenerateRequest,
    apiOptions?: ApiOptions
): Promise<CausalGeneration> => {
    return await api(`causal/generate`, {
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                modelName,
                temperature,
                maxTokens,
                streaming
            })
        },
        ...apiOptions
    });
};
export interface CausalLMQARequest {
    text: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    agent?: Agent;
    agentPath?: string;
    agentTools?: (AgentTool | string)[];
    chainType?: SummarizeChainType;
}
export const causalLMQA = async (
    {
        text,
        modelName,
        temperature,
        maxTokens,
        agent,
        agentPath,
        agentTools = [],
        chainType
    }: CausalLMQARequest,
    apiOptions?: ApiOptions
): Promise<CausalGeneration> => {
    return await api(`causal/qa`, {
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                modelName,
                temperature,
                maxTokens,
                agent,
                agentPath,
                agentTools,
                chainType
            })
        },
        ...apiOptions
    });
};
export interface CausalLMSummarizeRequest {
    text: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    chainType?: SummarizeChainType;
}
export const causalLMSummarize = async (
    { text, modelName, temperature, maxTokens, chainType }: CausalLMSummarizeRequest,
    apiOptions?: ApiOptions
): Promise<CausalGeneration> => {
    return await api(`causal/summarize`, {
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, modelName, temperature, maxTokens, chainType })
        },
        ...apiOptions
    });
};
export interface CausalLMConversationalRequest {
    text: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
}
export const causalLMConversational = async (
    { text, modelName, temperature, maxTokens }: CausalLMConversationalRequest,
    apiOptions?: ApiOptions
): Promise<CausalGeneration> => {
    return await api(`causal/conversational`, {
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, modelName, temperature, maxTokens })
        },
        ...apiOptions
    });
};

// ASR
export interface ASRTranscribeRequest {
    modelName?: string;
    file: File;
}
export const asrTranscribe = async (
    { modelName, file }: ASRTranscribeRequest,
    apiOptions?: ApiOptions
): Promise<AudioTranscription> => {
    const formData = new FormData();
    if (modelName !== undefined) formData.append("modelName", modelName);
    formData.append("file", file);

    return await api(`asr/transcribe`, {
        options: { method: "POST", body: formData },
        ...apiOptions
    });
};
