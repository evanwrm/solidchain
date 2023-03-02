// @refresh reload
import { Suspense } from "solid-js";
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Link,
    Meta,
    Routes,
    Scripts,
    Title
} from "solid-start";
import "~/styles/globals.css";

export default function Root() {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <Title>SolidChain</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta name="theme-color" content="#000" />
                <Link rel="shortcut icon" href="/favicons/favicon.ico" />
                <Link rel="icon" href="/favicons/favicon-16x16.png" sizes="16x16" />
                <Link rel="icon" href="/favicons/favicon-32x32.png" sizes="32x32" />
                <Link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="144x144" />
                <script>{`
                    // On page load or when changing themes, best to add inline in \`head\` to avoid FOUC
                    if ("theme" in localStorage) {
                        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
                        const theme = localStorage.getItem("theme") || "system";
                        const resolvedTheme = theme === "system" ? (systemPreference ? "dark" : "light") : theme;

                        document.documentElement.setAttribute("data-theme", resolvedTheme);
                    }
                `}</script>
            </Head>
            <Body class="scrollbar transition duration-150">
                <Suspense>
                    <ErrorBoundary>
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
