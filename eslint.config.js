// SPDX-FileCopyrightText: 2024 Telefónica and contributors
// SPDX-License-Identifier: MIT

import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import typescriptParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import pluginJest from "eslint-plugin-jest";
import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["node_modules/**", ".husky/**", "coverage/**", "dist/**"],
  },
  {
    files: ["**/*.json"],
    language: "json/json",
    plugins: {
      json,
    },
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  {
    files: ["**/*.md"],
    plugins: {
      markdown,
    },
    language: "markdown/commonmark",
    rules: {
      "markdown/no-html": "error",
    },
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs", "**/*.ts"],
    plugins: {
      prettier,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      ...eslintPluginPrettierRecommended.rules,
      camelcase: [2, { properties: "never" }],
      "no-console": [2, { allow: ["warn", "error"] }],
      "no-shadow": [2, { builtinGlobals: true, hoist: "all" }],
      "no-undef": [2],
      "no-unused-vars": [
        2,
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
    settings: {
      "import/resolver": {
        typescript: {
          extensions: [".ts", ".tsx"],
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
  },
  {
    files: ["**/*.spec.js", "**/*.test.js", "**/*.spec.ts", "**/*.test.ts"],
    plugins: {
      jest: pluginJest,
    },
    ...pluginJest.configs["flat/recommended"],
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      ...pluginJest.configs["flat/all"].rules,
      "jest/no-disabled-tests": "error",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "error",
      "jest/valid-expect": "error",
      "jest/prefer-strict-equal": [0],
      "jest/prefer-importing-jest-globals": [0],
      "jest/prefer-expect-assertions": [0],
      "jest/no-hooks": [0],
      "jest/prefer-called-with": [0],
      "jest/require-to-throw-message": [0],
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
  },
];
