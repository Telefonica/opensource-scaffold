// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { LogLevel } from "./Logger.types.js";
import type { Resource } from "./Resources.types.js";

/** Options for scaffold checker */
export interface CheckerOptions {
  /** Log level */
  log?: LogLevel;
}

export type ResourceReport = Omit<Resource, "origin">;
