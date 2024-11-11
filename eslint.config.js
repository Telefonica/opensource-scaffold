import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", ".husky/**"],
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
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    plugins: {
      prettier,
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
    files: ["tools/nodejs/license-compliance/**/*.js"],
    plugins: {
      jsdoc,
    },
    rules: {
      ...jsdoc.configs["flat/recommended-error"].rules,
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
