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
        route("contactez-nous", "routes/contacts.tsx"), // Contact Page
        route("carrieres", "routes/carriere.tsx"), // ✅ Carrière Page
        route("carriere-candidature/:jobId", "routes/carriere-candidature.tsx"), // ✅ Carrière Page
        route("nos-projets", "routes/nos-projets.tsx"), // Project Page
        route("faq", "routes/faq.tsx"), // ✅ FAQ Page

    ]),
    route("login", "routes/login.tsx"), // Login Page
    route("register", "routes/register.tsx"), // Register Page
    layout("./layout/protectedLayout.tsx", [
        route("dashboard", "./dashboard/dashboard.tsx", [
            index("./dashboard/dashboardOverview.tsx"), // Dashboard Overview
            route("contacts", "./dashboard/contact/contact.tsx"), // Contact Emails
            route("recruitment", "./dashboard/recruitment/recruitment.tsx"), // Recruitment Submissions
            route("jobs", "./dashboard/job-management/jobRoute.tsx"),
            route("companies", "./dashboard/companies/companies.tsx"),
            route("company/:id/jobs", "./dashboard/companies/companyJobs.tsx"), // Company Jobs
            // route("company/:id", "./dashboard/companies/companyDetails.tsx"), // Company Details
            // route("users", "./dashboard/users/users.tsx"), // User Management
            // route("user/:id", "./dashboard/users/userDetails.tsx"), // User Details
            // route("settings", "./dashboard/settings/settings.tsx"), // Settings Page
            // route("settings/profile", "./dashboard/settings/profile.tsx"), // Profile Settings
            // route("settings/password", "./dashboard/settings/password.tsx"), // Password Settings
            // route("settings/notifications", "./dashboard/settings/notifications.tsx"), // Notification Settings
        ])
    ]),
    route("maintenance", "routes/errors/maintenance.tsx"), // Under Construction Page
    route("*", "routes/errors/not-found.tsx") // Catch-all 404 Page
] satisfies RouteConfig;
