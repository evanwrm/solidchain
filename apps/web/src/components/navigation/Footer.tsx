import { For } from "solid-js";
import { A } from "solid-start";
import { quickRoutes } from "~/configs/routes";

const Footer = () => {
    return (
        <div class="container mt-4 flex w-full flex-col items-center justify-center">
            <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-base-content to-transparent opacity-10" />
            <div class="flex w-full flex-col items-center justify-between p-6 sm:flex-row">
                <div class="mb-2 flex">
                    <For each={quickRoutes}>
                        {route => (
                            <A
                                href={route.path}
                                class="px-2 opacity-80 transition hover:underline hover:opacity-100"
                            >
                                {route.name}
                            </A>
                        )}
                    </For>
                </div>
                <p class="opacity-80">
                    © Copyright {new Date().getFullYear()}. All Rights Reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
