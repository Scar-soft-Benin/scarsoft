// layout/mainLayout.tsx
import { Outlet, useLocation } from "react-router";
import Footer from "~/footer/footer";
import Header from "~/header/header";
import { getHeaderConfig } from "../header/headerConfig";
import { useTranslation } from "react-i18next";

export default function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const headerConfig = getHeaderConfig(t);

  // Gestion des routes dynamiques (comme /carriere-candidature/123)
  const matchedPath =
    Object.keys(headerConfig).find((path) =>
      path.includes(":")
        ? location.pathname.startsWith(path.split("/:")[0])
        : path === location.pathname
    ) || "/";

  const { bannerImage, title, subtitle, btnText } = headerConfig[matchedPath];

  return (
    <>
      <Header
        bannerImage={bannerImage}
        title={title}
        subtitle={subtitle}
        btnText={btnText}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
