module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    settings: {
        react: {
            version: "detect",
        },
    },
    parserOptions: {
        sourceType: "module",
        project: ["./packages/*/tsconfig.json"],
        tsconfigRootDir: __dirname,
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    ],
    rules: {
        "react/prop-types": ["off"],
        "react/react-in-jsx-scope": ["off"],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports" },
        ],
    },
};
