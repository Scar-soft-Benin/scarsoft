/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // Covers app/layout/, app/dashboard/, etc.
        "./app/dashboard/**/*.{js,ts,jsx,tsx}", // Explicitly include dashboard
        "./app/components/**/*.{js,ts,jsx,tsx}", // Explicitly include components
        "./app/routes/**/*.{js,ts,jsx,tsx}" // Explicitly include routes
    ],
    darkMode: ["class", ".dashboard-dark"], // Enable dark mode with 'dark' class
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#06FE01", // Logo green
                    light: "#4CFF4B", // Hover states
                    dark: "#05C701" // Pressed states
                },
                neutral: {
                    light: {
                        bg: "#F7FAFC",
                        surface: "#FFFFFF",
                        text: "#1A202C",
                        secondary: "#4A5568",
                        border: "#E2E8F0"
                    },
                    dark: {
                        bg: "#1A202C",
                        surface: "#2D3748",
                        text: "#EDF2F7",
                        secondary: "#A0AEC0",
                        border: "#4A5568"
                    }
                },
                success: "#38A169",
                warning: "#D69E2E",
                danger: "#E53E3E",
                info: "#3182CE",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                chivo: ["Chivo", "serif"], // Add Chivo font for font-chivo class
                poppins: ["Poppins", "serif"] // Add Poppins font for body
            }
        }
    },
    plugins: []
};
