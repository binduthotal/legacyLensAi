import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**", "build/**", ".next/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
