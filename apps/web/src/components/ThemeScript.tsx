import { isServer } from "solid-js/web";

const ThemeScript = () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (!isServer && "theme" in localStorage) {
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = localStorage.getItem("theme") ?? "system";
        const resolvedTheme = theme === "system" ? (systemPreference ? "dark" : "light") : theme;

        document.documentElement.setAttribute("data-theme", resolvedTheme);
    }
    return null;
};

export default ThemeScript;
