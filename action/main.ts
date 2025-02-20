// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import * as core from "@actions/core";

import { Checker } from "../src/Checker.js";
import type { LogLevel } from "../src/Logger.types.js";

/**
 * Returns the value if it is defined, otherwise returns undefined.
 * @param value The value to check.
 * @returns The value if it is defined, otherwise undefined.
 */
function valueIfDefined<T = string>(value: T): T | undefined {
  return value === "" ? undefined : value;
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const log = valueIfDefined((core.getInput("log") as LogLevel) || "");
    const checker = new Checker({ log });
    const result = await checker.check();

    core.setOutput("valid", result.valid.toString());
    core.setOutput("report", JSON.stringify(result.report));

    if (result.valid) {
      core.info(result.report.message);
    } else {
      core.error(result.report.message);
      core.setFailed(result.report.message);
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.error(error as Error);
    if (error instanceof Error) core.setFailed(error.message);
  }
}
