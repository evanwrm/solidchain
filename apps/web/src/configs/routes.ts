import { env } from "~/lib/env/client";

export const quickRoutes = [
    { path: "/", name: "Home" },
    { path: "/datasets", name: "Datasets" }
];
export const footerRoutes = [
    { path: env.VITE_API_DOCS, name: "API" },
    { path: env.VITE_GITHUB_REPO, name: "Github" }
];
