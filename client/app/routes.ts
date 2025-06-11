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
        route("nos-service", "routes/nos-service.tsx"), // Service Page
        route("nos-projets", "routes/nos-projets.tsx") // Project Page

    ]),
    route("login", "routes/login.tsx"), // Login Page
    route("register", "routes/register.tsx"), // Register Page
    layout("./layout/protectedLayout.tsx", [
        route("dashboard", "./dashboard/dashboard.tsx", [
            index("./dashboard/dashboardOverview.tsx"), // Dashboard Overview
            route("contacts", "./dashboard/contact/contact.tsx"), // Contact Emails
            route("recruitment", "./dashboard/recruitment/recruitment.tsx") // Recruitment Submissions
        ])
    ]),
    route("maintenance", "routes/errors/maintenance.tsx"), // Under Construction Page
    route("*", "routes/errors/not-found.tsx") // Catch-all 404 Page
] satisfies RouteConfig;
