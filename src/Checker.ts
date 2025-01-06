// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0
import { existsSync } from "fs";

import type { Logger } from "winston";

import type { CheckerOptions, ResourceReport } from "./Checker.types.js";
import { createLogger, DEFAULT_LEVEL } from "./Logger.js";
import { RESOURCES } from "./Resources.js";
import type { Resource } from "./Resources.types.js";

const ALL_VALID_MESSAGE = "All resources exist";
const SOME_INVALID_MESSAGE = "Some resources do not exist";

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
  private _logLevel: string;

  constructor({ log }: CheckerOptions = {}) {
    this._logLevel = log || DEFAULT_LEVEL;
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
  public async check() {
    this._logger.info("Hello world! This will check the opensource scaffold");

    const existingResources = this.getExistingResources();

    let nonExistingResources = [];

    for (const resource of RESOURCES) {
      if (!existingResources.find((r) => r.path === resource.path)) {
        this._logger.debug(`Resource ${resource.path} does not exist`);
        nonExistingResources.push(resource);
      }
    }

    const message =
      nonExistingResources.length === 0
        ? ALL_VALID_MESSAGE
        : `${SOME_INVALID_MESSAGE}: ${nonExistingResources.map((r) => r.name).join(", ")}`;

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
