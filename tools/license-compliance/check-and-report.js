import { checkLicenses } from "./check.js";

function log(message) {
  // eslint-disable-next-line no-console
  console.log("__License Compliance check__\n");
  // eslint-disable-next-line no-console
  console.log(message);
}

/**
 *
 * @param {Array} licenses Licenses failing the check
 * @param {string} type Type of license (dangerous or forbidden)
 * @param {*} emoji The emoji to use in the message
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
      message += `* __${license.module}__: ${license.licenses}\n`;
    }
    return message + "\n";
  }
  return "";
}

async function checkAndReportInMarkdown() {
  const licensesFailing = await checkLicenses();
  if (
    licensesFailing.errors.length === 0 &&
    licensesFailing.warnings.length === 0
  ) {
    log(":white_check_mark: All dependencies have acceptable licenses");
    return;
  }

  let message = "";
  message += getDependenciesMessage(
    licensesFailing.errors,
    "forbidden",
    ":exclamation:",
  );
  message += getDependenciesMessage(
    licensesFailing.warnings,
    "dangerous",
    ":warning:",
  );
  log(message);

  throw new Error("Dependency license check failed");
}

checkAndReportInMarkdown();
