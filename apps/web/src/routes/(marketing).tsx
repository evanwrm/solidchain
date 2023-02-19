import { Outlet } from "solid-start";
import BackToTop from "~/components/navigation/BackToTop";
import Footer from "~/components/navigation/Footer";
import Header from "~/components/navigation/Header";
import ProgressBar from "~/components/navigation/ProgressBar";

const RootLayout = () => {
    return (
        <div class="flex h-full min-h-screen w-full flex-col items-center justify-between overflow-clip text-base-content">
            <ProgressBar options={{ showSpinner: false, trickleSpeed: 300 }} />
            <Header />
            <Outlet />
            <BackToTop />
            <Footer />
        </div>
    );
};

export default RootLayout;
