import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
  },
  { rules: { "no-console": "error" } },
  // CLIs (translate, translate:check) escrevem no terminal.
  { files: ["scripts/**"], rules: { "no-console": "off" } },
  { ignores: ["dist/**", ".astro/**", "docs/**", "openspec/**"] },
];
