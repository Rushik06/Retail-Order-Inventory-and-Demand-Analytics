import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "path";

const __dirname = path.resolve();

export default defineConfig([
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/node_modules/**",
      "**/*.log",
      "coverage/**",
      "tmp/**",
      "temp/**",
      "apps/web-app/**",
        "**/*.cjs",        
    ],
  },

  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        tsconfigRootDir: __dirname,
        projectService: {
          allowDefaultProject: [
            "*.cjs",
            "*.js",
            "commitlint.config.cjs",
            "apps/*/src/config/*.cjs",
            "apps/*/src/migrations/*.cjs",
            "apps/*/src/seeders/*.cjs",
          ],
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off", 
      "@typescript-eslint/no-var-requires": "off",
    },
  },

  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);