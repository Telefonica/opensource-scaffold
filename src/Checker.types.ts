// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { LogLevel } from "./Logger.types.js";
import type { Resource } from "./Resources.types.js";

/** Options for scaffold checker */
export interface CheckerOptions {
  /** Log level */
  log?: LogLevel;
}

/** Report for a resource */
export type ResourceReport = Omit<Resource, "origin">;

/** Result of checking resources */
export interface CheckResult {
  /** Whether all resources are valid */
  valid: boolean;
  /** Report with missing resources */
  report: {
    /** Message with the result */
    message: string;
    /** List of missing resources */
    missing: ResourceReport[];
    /** List of found resources */
    found: ResourceReport[];
  };
}
