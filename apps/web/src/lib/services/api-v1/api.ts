import { env } from "~/lib/env/client";

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
    files: File[];
}
export const indexCreate = async ({ files }: IndexCreateRequest, apiOptions?: ApiOptions) => {
    const params = new URLSearchParams();

    const formData = new FormData();
    for (const file of files) formData.append("files", file);

    return await api(`upload?${params.toString()}`, {
        options: { method: "POST", body: formData },
        ...apiOptions
    });
};
