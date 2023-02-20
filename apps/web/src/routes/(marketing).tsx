import { Outlet } from "solid-start";
import BackToTop from "~/components/navigation/BackToTop";
import Footer from "~/components/navigation/Footer";
import Header from "~/components/navigation/Header";
import ProgressBar from "~/components/navigation/ProgressBar";
import ThemeProvider from "~/components/providers/ThemeProvider";

const RootLayout = () => {
    return (
        <ThemeProvider>
            <div class="flex h-full min-h-screen w-full flex-col items-center justify-between overflow-clip bg-base-100 text-base-content transition">
                <ProgressBar options={{ showSpinner: false, trickleSpeed: 300 }} />
                <Header />
                <Outlet />
                <BackToTop />
                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default RootLayout;
