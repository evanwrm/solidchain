import { createContext } from "solid-js";
import { createRouteData, Outlet, refetchRouteData, useRouteData } from "solid-start";
import BackToTop from "~/components/navigation/BackToTop";
import ProgressBar from "~/components/navigation/ProgressBar";
import ThemeProvider from "~/components/providers/ThemeProvider";
import Footer from "~/components/templates/Footer";
import Header from "~/components/templates/Header";
import { settingsFindOne } from "~/lib/services/api-v1/api";
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

export const routeData = () => {
    return createRouteData(() => settingsFindOne({}), { key: ["settingsFindOne"] });
};

const RootLayout = () => {
    const settings = useRouteData<typeof routeData>();

    const apiSettingsSlice: ApiSettingsSlice = [
        settings(),
        { refetch: () => refetchRouteData(["settingsFindOne"]) }
    ];

    return (
        <ApiSettingsContext.Provider value={apiSettingsSlice}>
            <ThemeProvider>
                <div class="flex min-h-screen flex-col items-center justify-between overflow-clip bg-base-100 text-base-content transition">
                    <ProgressBar options={{ showSpinner: false, trickleSpeed: 300 }} />
                    <Header />
                    <Outlet />
                    <BackToTop />
                    <Footer />
                </div>
            </ThemeProvider>
        </ApiSettingsContext.Provider>
    );
};

export default RootLayout;
