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
];
