// @ts-expect-error No types.
import node from "solid-start-node";
import vercel from "solid-start-vercel";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
    plugins: [
        solid({
            adapter: isVercel ? vercel({ edge: true }) : node()
        })
    ],
    ssr: {
        noExternal: ["@kobalte/core"]
    }
});
