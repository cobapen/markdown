import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "build/",
      "dist/",
      "docs/",
      "node_modules/",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    }
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    files: ["**/*.js", "**/*.ts"],
    rules: {
      "@stylistic/semi": "warn",
      "@stylistic/quotes": ["warn", "double"],
      "@stylistic/indent": ["warn", 2],
    },
  },
];