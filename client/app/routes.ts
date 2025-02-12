// routes.ts
import {
    type RouteConfig,
    route,
    index,
    layout
} from "@react-router/dev/routes";

export default [
    layout("./layout/mainLayout.tsx", [
        index("routes/home.tsx"), // Home Page
        route("a-propos", "routes/a-propos.tsx"), // About Us Page
        route("nos-service", "routes/nos-service.tsx") // service Page
    ]),
    route("maintenance", "routes/errors/maintenance.tsx"), // Under Construction Page
    route("*", "routes/errors/not-found.tsx") // Catch-all 404 Page
] satisfies RouteConfig;
