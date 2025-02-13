// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { Resource } from "./Resources.types.js";

/**
 * List of open source scaffold resources
 */
export const RESOURCES: Resource[] = [
  {
    name: "License file",
    path: "LICENSE",
    origin: "templates/license-files/<%= license %>",
  },
  {
    name: "Readme file",
    path: "README.md",
    origin: "templates/README.md",
  },
  {
    name: "Changelog file",
    path: "CHANGELOG.md",
    origin: "templates/CHANGELOG.md",
  },
  {
    name: "Bugs template",
    path: ".github/ISSUE_TEMPLATE/BUG.yml",
    origin: "templates/.github/ISSUE_TEMPLATE/BUG.yml",
  },
  {
    name: "Feature request template",
    path: ".github/ISSUE_TEMPLATE/FEATURE_REQUEST.yml",
    origin: "templates/.github/ISSUE_TEMPLATE/FEATURE_REQUEST.yml",
  },
  {
    name: "Issue template config",
    path: ".github/ISSUE_TEMPLATE/config.yml",
    origin: "templates/.github/ISSUE_TEMPLATE/config.yml",
  },
  {
    name: "Pull request template",
    path: ".github/PULL_REQUEST_TEMPLATE.md",
    origin: "templates/.github/PULL_REQUEST_TEMPLATE.md",
  },
  {
    name: "Code of conduct",
    path: ".github/CODE_OF_CONDUCT.md",
    origin: "templates/.github/CODE_OF_CONDUCT.md",
  },
  {
    name: "Contributing guidelines",
    path: ".github/CONTRIBUTING.md",
    origin: "templates/.github/CONTRIBUTING.md",
  },
  {
    name: "Contributors License Agreement",
    path: ".github/CLA.md",
    origin: "templates/.github/CLA.md",
  },
  {
    name: "Check license compliance config",
    path: ".github/check-license-compliance.config.yml",
    origin: "templates/check-license-compliance-configs/<%= license %>.yml",
  },
  {
    name: "Check SPDX headers config",
    path: ".github/check-spdx-headers.config.yml",
    origin: "templates/.github/check-spdx-headers.config.yml",
  },
  {
    name: "CLA workflow",
    path: ".github/workflows/contributor-license-agreement.yml",
    origin: "templates/.github/workflows/contributor-license-agreement.yml",
  },
  {
    name: "Open source checks workflow",
    path: ".github/workflows/open-source-checks.yml",
    origin: "templates/.github/workflows/open-source-checks.yml",
  },
];
