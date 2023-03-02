import { createContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createRouteData, Outlet, refetchRouteData, useRouteData } from "solid-start";
import BackToTop from "~/components/navigation/BackToTop";
import ProgressBar from "~/components/navigation/ProgressBar";
import ThemeProvider from "~/components/providers/ThemeProvider";
import Footer from "~/components/templates/Footer";
import Header from "~/components/templates/Header";
import { settingsFindOne } from "~/lib/services/api-v1/api";
import { cn } from "~/lib/utils/styles";
import { ApiSettings } from "~/lib/validators/Settings";

// context
type ApiSettingsSlice = [
    ApiSettings | undefined,
    {
        refetch: () => void;
    }
];
export const ApiSettingsContext = createContext<ApiSettingsSlice>([
    undefined,
    { refetch: () => {} }
]);

interface Settings {
    layout: "workspace" | "scroll";
}
type SettingsSlice = [
    Settings | undefined,
    {
        setLayout: (layout: "workspace" | "scroll") => void;
    }
];
export const SettingsContext = createContext<SettingsSlice>([undefined, { setLayout: () => {} }]);

export const routeData = () => {
    return createRouteData(() => settingsFindOne({}), { key: ["settingsFindOne"] });
};

const RootLayout = () => {
    const apiSettings = useRouteData<typeof routeData>();
    const [settings, setSettings] = createStore<Settings>({ layout: "workspace" });

    const settingsSlice: SettingsSlice = [
        settings,
        { setLayout: layout => setSettings("layout", layout) }
    ];
    const apiSettingsSlice: ApiSettingsSlice = [
        apiSettings(),
        { refetch: () => refetchRouteData(["settingsFindOne"]) }
    ];

    return (
        <SettingsContext.Provider value={settingsSlice}>
            <ApiSettingsContext.Provider value={apiSettingsSlice}>
                <ThemeProvider>
                    <div
                        class={cn(
                            "flex min-h-screen flex-col items-center justify-between overflow-clip bg-base-100 text-base-content transition",
                            settings.layout === "workspace" ? "max-h-screen" : "max-h-none"
                        )}
                    >
                        <ProgressBar options={{ showSpinner: false, trickleSpeed: 300 }} />
                        <Header />
                        <Outlet />
                        <BackToTop />
                        <Footer />
                    </div>
                </ThemeProvider>
            </ApiSettingsContext.Provider>
        </SettingsContext.Provider>
    );
};

export default RootLayout;
