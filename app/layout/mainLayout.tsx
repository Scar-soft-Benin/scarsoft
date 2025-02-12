import { Outlet, useLocation } from "react-router";
import Footer from "~/footer/footer";
import Header from "~/header/header";
import { headerConfig } from "../header/headerConfig";

export default function MainLayout() {
    const location = useLocation();
    const { bannerImage, title, subtitle, btnText } =
        headerConfig[location.pathname] || headerConfig["/"];
    return (
        <>
            <Header
                bannerImage={bannerImage}
                title={title}
                subtitle={subtitle}
                btnText={btnText}
            />
            <main>
                <Outlet /> {/* This will render the current page content */}
            </main>
            <Footer />
        </>
    );
}
