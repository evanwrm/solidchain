import { For } from "solid-js";
import { A, useLocation } from "solid-start";
import ThemeToggle from "~/components/inputs/ThemeToggle";
import SettingsModal from "~/components/settings/SettingsModal";
import { quickRoutes } from "~/configs/routes";

const Header = () => {
    const location = useLocation();
    const active = (path: string) =>
        path == location.pathname ? "border-primary" : "border-transparent hover:border-primary";
    return (
        <nav class="flex h-16 w-full items-center justify-center bg-base-100 text-base-content shadow transition">
            <ul class="container flex items-center p-3">
                <For each={quickRoutes}>
                    {route => (
                        <li
                            class={`border-b-2 ${active(
                                route.path
                            )} mx-1.5 text-base-content opacity-80 transition hover:opacity-100 sm:mx-3`}
                        >
                            <A href={route.path}>{route.name}</A>
                        </li>
                    )}
                </For>
            </ul>
            <div class="flex items-center justify-center gap-x-3">
                <ThemeToggle class="h-6 w-6 opacity-80 hover:opacity-100" />
                <SettingsModal class="h-6 w-6 opacity-80 hover:opacity-100" />
            </div>
        </nav>
    );
};

export default Header;
