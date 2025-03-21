// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0
import { existsSync } from "fs";

import globule from "globule";
import type { Logger } from "winston";

import type { CheckerOptions, ResourceReport, CheckResult } from "./Checker.types.js";
import { createLogger, DEFAULT_LEVEL } from "./Logger.js";
import { RESOURCES } from "./Resources.js";
import type { Resource } from "./Resources.types.js";

const ALL_VALID_MESSAGE = "All resources exist";

function resourceToReport(resource: Resource): ResourceReport {
  return {
    name: resource.name,
    path: resource.path,
  };
}

/**
 * Class for checking scaffold resources
 */
export class Checker {
  private _logger: Logger;
  private _ignore?: string[];
  private _logLevel: string;

  constructor({ log, ignore }: CheckerOptions = {}) {
    this._logLevel = log || DEFAULT_LEVEL;
    this._ignore = ignore;
    this._logger = createLogger(log);
  }

  /**
   * Get a list of existing resources
   * @param silent Whether to suppress logging
   * @returns A list of existing resources
   */
  public getExistingResources(silent = false) {
    if (silent) {
      this._logger.level = "error";
    }
    this._logger.verbose("Looking for existing resources");

    let existingResources = [];
    for (const resource of RESOURCES) {
      if (existsSync(resource.path)) {
        this._logger.silly(`Found existing resource ${resource.path}`);
        existingResources.push(resource);
      }
    }
    this._logger.level = this._logLevel;
    return existingResources;
  }

  /**
   * Check if scaffold resources exist
   */
  public async check(): Promise<CheckResult> {
    const existingResources = this.getExistingResources();

    let nonExistingResources = [];

    for (const resource of RESOURCES) {
      if (!existingResources.find((r) => r.path === resource.path)) {
        if (
          this._ignore &&
          globule.isMatch(this._ignore, resource.path, {
            dot: true,
          })
        ) {
          this._logger.warn(`Resource ${resource.path} is ignored`);
          continue;
        } else {
          this._logger.debug(`Resource ${resource.path} does not exist`);
          nonExistingResources.push(resource);
        }
      } else {
        this._logger.debug(`Resource ${resource.path} exists`);
      }
    }

    const message =
      nonExistingResources.length === 0
        ? ALL_VALID_MESSAGE
        : `${nonExistingResources.length} missing resource${nonExistingResources.length > 1 ? "s" : ""}: ${nonExistingResources.map((r) => `${r.name} (${r.path})`).join(", ")}`;

    if (nonExistingResources.length === 0) {
      this._logger.info(message);
    } else {
      this._logger.warn(message);
    }

    return {
      valid: nonExistingResources.length === 0,
      report: {
        message,
        missing: nonExistingResources.map((r) => resourceToReport(r)),
        found: existingResources.map((r) => resourceToReport(r)),
      },
    };
  }
}
