import tsParser from "@typescript-eslint/parser"

export default [
  {
    ignores: [
      ".next/**",
      "archive/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {},
  },
]
