// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: MIT

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/test/unit/specs/*.spec.ts", "<rootDir>/test/unit/specs/**/*.test.ts"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Remove all import extensions
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  reporters: [
    "default",
    ["jest-sonar", { outputDirectory: "coverage", outputName: "unit-junit-report.xml" }],
  ],
};
