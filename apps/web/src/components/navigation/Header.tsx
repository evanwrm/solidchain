import { For } from "solid-js";
import { A, useLocation } from "solid-start";

const routes = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" }
];

const Header = () => {
    const location = useLocation();
    const active = (path: string) =>
        path == location.pathname ? "border-primary" : "border-transparent hover:border-primary";
    return (
        <nav class="flex h-16 w-full items-center justify-center bg-base-100 text-base-content shadow">
            <ul class="container flex items-center p-3">
                <For each={routes}>
                    {route => (
                        <li
                            class={`border-b-2 ${active(
                                route.path
                            )} mx-1.5 opacity-80 transition hover:opacity-100 sm:mx-6`}
                        >
                            <A href={route.path}>{route.name}</A>
                        </li>
                    )}
                </For>
            </ul>
        </nav>
    );
};

export default Header;
