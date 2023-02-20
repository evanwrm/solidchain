import { env } from "~/lib/env/client";
import { VectorDbType } from "~/lib/validators/VectorStore";

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
            Origin: env.VITE_SITE_URL,
            ...(options.headers || {})
        }
    });
    return res.headers.get("Content-Type")?.includes("application/json")
        ? await res.json()
        : await res.text();
};

export interface IndexCreateRequest {
    name: string;
    description: string;
    vectorDb: VectorDbType;
    urls: string[];
    files: File[];
}
export const indexCreate = async (
    { name, description, vectorDb, urls, files }: IndexCreateRequest,
    apiOptions?: ApiOptions
) => {
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
