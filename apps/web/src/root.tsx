// @refresh reload
import { Suspense } from "solid-js";
import {
    A,
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Meta,
    Routes,
    Scripts,
    Title,
    useLocation
} from "solid-start";
import "./root.css";

export default function Root() {
    const location = useLocation();
    const active = (path: string) =>
        path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
    return (
        <Html lang="en">
            <Head>
                <Title>SolidStart - With TailwindCSS</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <nav class="flex h-16 items-center justify-center bg-base-100 text-base-content shadow">
                            <ul class="container flex items-center p-3">
                                <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
                                    <A href="/">Home</A>
                                </li>
                                <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
                                    <A href="/about">About</A>
                                </li>
                            </ul>
                        </nav>
                        <Routes>
                            <FileRoutes />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <Scripts />
            </Body>
        </Html>
    );
}
