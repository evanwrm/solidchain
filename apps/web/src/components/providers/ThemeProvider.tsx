import { createContext, createEffect, createSignal, JSX, mergeProps, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

// helpers
export const colorSchemes = ["light", "dark"];
export const MEDIA = "(prefers-color-scheme: dark)";

export const getTheme = (key: string, fallback?: string) => {
    if (isServer) return undefined;
    let theme;
    try {
        theme = localStorage.getItem(key) ?? undefined;
    } catch (e) {}
    return theme ?? fallback;
};
export const applyTheme = (newTheme: string, attribute: string, fallback?: string) => {
    if (attribute === "class") {
        document.documentElement.classList.remove(...colorSchemes);
        if (newTheme) document.documentElement.classList.add(newTheme);
    } else {
        if (newTheme) document.documentElement.setAttribute(attribute, newTheme);
        else document.documentElement.removeAttribute(attribute);
    }

    const fallbackScheme = colorSchemes.includes(fallback ?? "") ? fallback : null;
    const colorScheme = colorSchemes.includes(newTheme) ? newTheme : fallbackScheme;
    // @ts-ignore
    document.documentElement.style.colorScheme = colorScheme;
};
export const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
    if (!e) e = window.matchMedia(MEDIA);
    return e.matches ? "dark" : "light";
};

// Context
interface ThemeStore {
    theme: string;
    resolvedTheme: string;
    isDark: boolean;
}
type ThemeContextSlice = [
    ThemeStore,
    {
        setTheme: (theme: string) => void;
        toggleDarkMode: () => void;
    }
];
export const ThemeContext = createContext<ThemeContextSlice>([
    { theme: "system", resolvedTheme: "dark", isDark: true },
    { setTheme: () => {}, toggleDarkMode: () => {} }
]);

// Provider
interface Props {
    children: JSX.Element;
    defaultTheme?: string;
    storageKey?: string;
    attribute?: string;
}

const ThemeProvider = (props: Props) => {
    props = mergeProps(
        { defaultTheme: "system", storageKey: "theme", attribute: "data-theme" },
        props
    );

    const [theme, setSignalTheme] = createSignal("system");
    const [themeStore, setThemeStore] = createStore<ThemeStore>({
        theme: "system",
        resolvedTheme: "dark",
        isDark: true
    });

    const setTheme = (newTheme: string) => {
        applyTheme(newTheme, props.attribute!, props.defaultTheme);
        setSignalTheme(newTheme);
        try {
            localStorage.setItem(props.storageKey!, newTheme);
        } catch (e) {}
    };
    const toggleDarkMode = () => {
        if (themeStore.isDark) setTheme("light");
        else setTheme("dark");
    };

    const handleStorage = (e: StorageEvent) => {
        if (e.key !== props.storageKey) return;
        // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
        const theme = e.newValue ?? props.defaultTheme!;
        setTheme(theme);
    };
    const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
        setTheme(getSystemTheme(e));
    };

    createEffect(() => {
        if (!isServer) {
            const resolvedTheme = theme() === "system" ? getSystemTheme() : theme();
            setThemeStore("theme", theme());
            setThemeStore("resolvedTheme", resolvedTheme);
            setThemeStore("isDark", resolvedTheme === "dark");
        }
    });
    createEffect(() => {
        if (!isServer) {
            const media = window.matchMedia(MEDIA);
            media.addListener(handleMediaQuery);
            window.addEventListener("storage", handleStorage);
            setTheme(getTheme(props.storageKey!, props.defaultTheme) ?? getSystemTheme(media));

            onCleanup(() => {
                const media = window.matchMedia(MEDIA);
                media.removeListener(handleMediaQuery);
                window.removeEventListener("storage", handleStorage);
            });
        }
    });

    const themeSlice: ThemeContextSlice = [
        themeStore,
        {
            setTheme,
            toggleDarkMode
        }
    ];

    return <ThemeContext.Provider value={themeSlice}>{props.children}</ThemeContext.Provider>;
};

export default ThemeProvider;
