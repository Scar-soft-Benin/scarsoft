/** @type {import('tailwindcss').Config} */
export default {
    content: ["./app/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // Enable dark mode with 'dark' class
    theme: {
        extend: {
            colors: {
                primary: "#1E3A8A",
                secondary: "#10B981"
            }
        }
    },
    plugins: []
};
