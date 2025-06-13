import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "react-router";
import { AuthProvider } from "~/context/authContext";
import { LoadingProvider, useLoading } from "~/context/loadingContext";
import Loading from "~/components/loading";
import type { Route } from "./+types/root";
import "./app.css";
import "../i18n.js";
import { useEffect } from "react";
import Message from "./components/message";
import { MessageProvider } from "./context/messageContext";
import { ThemeProvider } from "./context/themeContext";
import { SidebarProvider } from "~/context/sidebarContext";

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    }
];

function AppContent() {
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        // Show loading on initial render
        showLoading();
        // Simulate app initialization (replace with actual logic if needed)
        const timer = setTimeout(() => hideLoading(), 1000); // 1-second delay
        return () => clearTimeout(timer);
    }, [showLoading, hideLoading]);

    return (
        <>
            <Loading />
            <Message />
            <Outlet />
        </>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <MessageProvider>
                <AuthProvider>
                    <SidebarProvider>
                        <LoadingProvider>
                            <AppContent />
                        </LoadingProvider>
                    </SidebarProvider>
                </AuthProvider>
            </MessageProvider>
        </ThemeProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
