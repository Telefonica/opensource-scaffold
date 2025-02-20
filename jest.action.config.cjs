// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["action/**/*.ts"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage-action",

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/test/action/specs/*.spec.ts", "<rootDir>/test/action/specs/**/*.test.ts"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Remove all import extensions
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  setupFiles: ["./test/action/setup.ts"],

  reporters: [
    "default",
    [
      "jest-sonar",
      {
        outputDirectory: "coverage-action",
        outputName: "action-junit-report.xml",
      },
    ],
  ],
};
