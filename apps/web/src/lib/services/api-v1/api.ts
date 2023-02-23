import { env } from "~/lib/env/client";
import { Agent, AgentTool } from "~/lib/validators/Agents";
import { ApiSettings } from "~/lib/validators/Settings";
import { CausalGeneration } from "~/lib/validators/TextGeneration";
import { VectorDbType, VectorStore } from "~/lib/validators/VectorStore";

interface ApiOptions {
    fetcher?: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
    options?: RequestInit;
}
export const api = async (resource: string, { fetcher = fetch, options = {} }: ApiOptions = {}) => {
    const host = env.VITE_API_ENDPOINT;
    const res = await fetcher(`${host}/${resource}`, {
        method: "GET",
        ...options,
        headers: {
            Origin: env.VITE_SITE_NAME,
            ...(options.headers ?? {})
        }
    });
    return res.headers.get("Content-Type")?.includes("application/json")
        ? await res.json()
        : await res.text();
};

export interface SettingsFindOneRequest {}
export const settingsFindOne = async (
    {}: SettingsFindOneRequest,
    apiOptions?: ApiOptions
): Promise<ApiSettings> => {
    const params = new URLSearchParams();
    return await api(`settings?${params.toString()}`, apiOptions);
};

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
    vectorDb?: VectorDbType;
    urls?: string[];
    files?: File[];
}
export const vectorstoreCreate = async (
    { name, description, vectorDb, urls = [], files = [] }: VectorstoreCreateRequest,
    apiOptions?: ApiOptions
): Promise<VectorStore> => {
    const params = new URLSearchParams();
    params.append("name", name);
    if (description !== undefined) params.append("description", description);
    if (vectorDb !== undefined) params.append("vectorDb", vectorDb);
    for (const url of urls) params.append("urls", url);

    const formData = new FormData();
    for (const file of files) formData.append("files", file);

    return await api(`vectorstores/create?${params.toString()}`, {
        options: { method: "POST", body: formData },
        ...apiOptions
    });
};

export interface CausalLMGenerateRequest {
    text: string;
    modelName?: string;
    temperature?: number;
    agent?: Agent;
    agentPath?: string;
    agentTools?: AgentTool[];
}
export const causalLMGenerate = async (
    { text, modelName, temperature, agent, agentTools = [] }: CausalLMGenerateRequest,
    apiOptions?: ApiOptions
): Promise<CausalGeneration> => {
    const params = new URLSearchParams();
    params.append("text", text);
    if (modelName !== undefined) params.append("modelName", modelName);
    if (temperature !== undefined) params.append("temperature", temperature.toString());
    if (agent !== undefined) params.append("agent", agent);
    for (const tool of agentTools) params.append("agentTools", tool);

    return await api(`causal/generate?${params.toString()}`, {
        options: { method: "POST" },
        ...apiOptions
    });
};
