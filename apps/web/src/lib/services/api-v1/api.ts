import { env } from "~/lib/env/client";
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

export interface VectorstoreCreateRequest {
    name: string;
    description: string;
    vectorDb: VectorDbType;
    urls: string[];
    files: File[];
}
export const vectorstoreCreate = async (
    { name, description, vectorDb, urls, files }: VectorstoreCreateRequest,
    apiOptions?: ApiOptions
): Promise<VectorStore> => {
    const params = new URLSearchParams();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("vectorDb", vectorDb);
    for (const url of urls) formData.append("urls", url);
    for (const file of files) formData.append("files", file);

    return await api(`upload?${params.toString()}`, {
        options: { method: "POST", body: formData },
        ...apiOptions
    });
};

export interface CausalLMGenerateRequest {
    text: string;
    modelName?: string;
    temperature?: number;
}
export const causalLMGenerate = async (
    { modelName, temperature, text }: CausalLMGenerateRequest,
    apiOptions?: ApiOptions
): Promise<CausalGeneration> => {
    const params = new URLSearchParams();
    if (modelName !== undefined) params.append("modelName", modelName);
    if (temperature !== undefined) params.append("temperature", temperature.toString());
    params.append("text", text);

    return await api(`causal/generate?${params.toString()}`, {
        options: { method: "POST" },
        ...apiOptions
    });
};
