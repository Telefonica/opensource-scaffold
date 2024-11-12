// SPDX-FileCopyrightText: 2024 Telefónica and contributors. All rights reserved
// SPDX-License-Identifier: MPL-2.0

import { checkLicenses } from "./check.js";

/**
 * @typedef {import('./check.js').licenseCheckerResult} licenseCheckerResult
 */

/**
 * Logs a message to the console
 * @param {string} message The message to log
 */
function log(message) {
  // eslint-disable-next-line no-console
  console.log("__License Compliance check - Node__\n");
  // eslint-disable-next-line no-console
  console.log(message);
}

/**
 * Returns a message with the dependencies that failed the check
 * @param {licenseCheckerResult[]} licenses Licenses failing the check
 * @param {string} type Type of license (dangerous or forbidden)
 * @param {string} emoji The emoji to use in the message
 * @returns {string} The message
 */
function getDependenciesMessage(licenses, type, emoji) {
  if (licenses.length > 0) {
    let message = "";
    if (licenses.length > 1) {
      message += `${emoji} There are ${licenses.length} dependencies`;
    } else {
      message += `${emoji} There is 1 dependency`;
    }
    message += ` with ${type} licenses:\n\n`;
    for (const license of licenses) {
      const licensesToPrint = Array.isArray(license.licenses)
        ? license.licenses.join(", ")
        : license.licenses;
      message += `* __${license.module}__: ${licensesToPrint}\n`;
    }
    return message + "\n";
  }
  return "";
}

/**
 * Checks the licenses of the dependencies and reports the results in markdown format. It may throw an error or not depending on the configuration.
 */
async function checkAndReportInMarkdown() {
  const { forbidden, warning, config } = await checkLicenses();
  if (forbidden.length === 0 && warning.length === 0) {
    log(":white_check_mark: All dependencies have acceptable licenses");
    return;
  }

  let message = "";
  message += getDependenciesMessage(forbidden, "forbidden", ":exclamation:");
  message += getDependenciesMessage(warning, "dangerous", ":warning:");

  if (
    (config.errorOnForbidden && forbidden.length > 0) ||
    (config.errorOnWarning && warning.length > 0)
  ) {
    message += ":x: This is non-compliant. Please fix the dependencies.";
    log(message);
    throw new Error("Dependency license check failed");
  }

  message +=
    ":warning: This is compliant according to the configuration, but you should review the dependencies.";
  log(message);
  return;
}

checkAndReportInMarkdown();
