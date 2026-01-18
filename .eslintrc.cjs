/* eslint-disable prettier/prettier */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
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
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    quotes: ["error", "double", { avoidEscape: true }],
    "no-undef": "off",
    "import/extensions": [
      "error",
      "never",
      { js: "never", jsx: "never", ts: "never", tsx: "never", json: "always" },
    ],
  },
};
