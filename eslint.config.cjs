const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  { ignores: ["playwright/.venv/**", "playwright/pages/js_scripts/**"] },

  js.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tseslint,
      prettier,
    },

    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: true,
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        alias: {
          map: [["@", "./src"]],
        },
      },
    },

    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,

      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "off", // replaced by the TS version below
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-undef": "off", // tsc already checks this

      // console.log is debug noise; real problems should use warn/error
      "no-console": ["error", { allow: ["warn", "error"] }],

      quotes: ["error", "double", { avoidEscape: true }],

      "import/extensions": [
        "error",
        "never",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
          json: "always",
        },
      ],
    },
  },

  // seo/ = CLI scripts, console output is their UI
  {
    files: ["src/seo/**"],
    rules: {
      "no-console": "off",
    },
  },

  // tests and mocks don't ship to users
  {
    files: [
      "**/__test__/**",
      "**/__mocks__/**",
      "**/*.test.{ts,tsx}",
      "src/setupTests.ts",
    ],
    rules: {
      "no-console": "off",
    },
  },
];
