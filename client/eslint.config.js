import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import typescriptEslint from "typescript-eslint";

export default [
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            react
        },
        languageOptions: {
            globals: {
                ...globals.browser
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            "react/prop-types": "off", // Disable prop-types (using TypeScript)
            "react/react-in-jsx-scope": "off", // Disable react-in-jsx-scope for React 17+
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "no-empty-pattern": "off", // Disable no-empty-pattern rule
        }
    }
];
