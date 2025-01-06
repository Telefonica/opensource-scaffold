// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: MIT

import { createRequire } from "module";

import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import pluginJest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

// eslint-disable-next-line no-shadow
const require = createRequire(import.meta.url);
const requireExtensions = require("eslint-plugin-require-extensions");

export default [
  {
    ignores: [
      "node_modules/**",
      ".husky/**",
      "coverage/**",
      "coverage-action/**",
      "dist/**",
      "dist-action/**",
    ],
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
      "no-unused-vars": [2, { vars: "all", args: "after-used", ignoreRestSiblings: false }],
      "prettier/prettier": [
        2,
        {
          printWidth: 99,
          parser: "typescript",
        },
      ],
      "import/no-relative-packages": [2],
      "import/order": [
        2,
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [],
          "newlines-between": "always",
          alphabetize: {
            order: "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */,
          },
        },
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
      "@typescript-eslint/consistent-type-imports": [
        2,
        {
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/member-ordering": 2,
      "@typescript-eslint/explicit-member-accessibility": [
        2,
        { overrides: { constructors: "no-public" } },
      ],
      "@typescript-eslint/no-unused-vars": 2,
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
    files: ["action/**/*.ts", "src/**/*.ts"],
    plugins: {
      "require-extensions": requireExtensions,
    },
    rules: {
      ...requireExtensions.configs.recommended.rules,
    },
  },
  {
    files: ["action/**/*.ts"],
    settings: {
      "import/resolver": {
        typescript: {
          extensions: [".ts", ".tsx"],
          alwaysTryTypes: true,
          project: ["./action/tsconfig.json"],
        },
        node: true,
      },
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "test/unit/**/*.ts"],
    plugins: {
      jest: pluginJest,
    },
    ...pluginJest.configs["flat/recommended"],
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    settings: {
      "import/resolver": {
        typescript: {
          extensions: [".ts", ".tsx"],
          alwaysTryTypes: true,
          project: ["./test/unit/tsconfig.json"],
        },
        node: true,
      },
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
    files: ["test/unit/**/*.ts", "test/unit/**/*.test.ts"],
    settings: {
      "import/resolver": {
        typescript: {
          extensions: [".ts", ".tsx"],
          alwaysTryTypes: true,
          project: ["./test/unit/tsconfig.json"],
        },
        node: true,
      },
    },
  },
  {
    files: ["test/action/**/*.spec.ts", "test/action/**/*.test.ts"],
    settings: {
      "import/resolver": {
        typescript: {
          extensions: [".ts", ".tsx"],
          alwaysTryTypes: true,
          project: ["./test/action/tsconfig.json"],
        },
        node: true,
      },
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
