import html from "eslint-plugin-html";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
    {
        files: ["**/*.html", "**/*.jsx"],
        plugins: {
            html,
            react
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                React: "readonly",
                ReactDOM: "readonly",
                Color: "readonly",
                Papa: "readonly",
                Plotly: "readonly",
                d3: "readonly",
                tailwind: "readonly",
                PointerEvent: "readonly",
                MouseEvent: "readonly"
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            "no-undef": "error",
            "no-unused-vars": "off",
            "no-use-before-define": "error"
        }
    }
];
