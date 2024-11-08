import { cwd } from "node:process";
import { resolve as pathResolve } from "node:path";
import { readFile } from "node:fs/promises";
import yaml from "yaml";
import licenseChecker from "license-checker";

const ROOT_DIR = cwd();

/**
 * Reads the license-check.config.yaml file
 * @returns {Promise<Object>} - Object containing the configuration
 */
async function readConfig() {
  return yaml.parse(
    await readFile(
      pathResolve(ROOT_DIR, "license-compliance-node.config.yml"),
      "utf-8",
    ),
  );
}

/**
 * Returns an array of packages using a license that is not in the exclusions, or is unknown
 * @param {string[]} exclusions - List of licenses to exclude
 * @param {Object} options - Options for the license-checker
 * @returns {Promise<{module: string, ...licenseCheckerResult}[]>} - List of packages using a license that is not in the exclusions
 */
async function checkLicensesExcluding(exclusions, options = {}) {
  return new Promise((resolve, reject) => {
    licenseChecker.init(
      {
        start: ROOT_DIR,
        exclude: exclusions.join(","),
        relativeLicensePath: true,
        ...options,
      },
      (err, packages) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            Object.entries(packages).map(([moduleName, result]) => ({
              module: moduleName,
              ...result,
            })),
          );
        }
      },
    );
  });
}

/**
 * Returns an array of modules using a forbidden license
 * @param {Object} config - Configuration object for the license-checker
 * @returns {Promise<Object>} - Array of modules
 */
function checkForbiddenLicenses(config) {
  return checkLicensesExcluding(
    [...(config.licenses?.allowed || []), ...(config.licenses?.warning || [])],
    {
      ...config.licenseCheckerOptions?.global,
      ...config.licenseCheckerOptions?.forbidden,
    },
  );
}

/**
 * Returns an array of modules using licenses that require special attention
 * @param {Object} config - Configuration object for the license-checker
 * @returns {Promise<Object>} - Array of modules
 */
function checkWarningLicenses(config) {
  return checkLicensesExcluding(
    [
      ...(config.licenses?.allowed || []),
      ...(config.licenses?.forbidden || []),
    ],
    {
      unknown: true,
      ...config.licenseCheckerOptions?.global,
      ...config.licenseCheckerOptions?.warning,
    },
  );
}

/**
 * Returns an object detailing which modules use forbidden licenses and which use licenses that require special attention
 * @returns Object containing errors and warnings properties, each with an array of modules, and the config object
 */
export async function checkLicenses() {
  const config = await readConfig();
  const forbidden = await checkForbiddenLicenses(config);
  const warnings = await checkWarningLicenses(config);
  const warningsWithoutErrors = warnings.filter(
    (warning) =>
      !forbidden.some(
        (forbiddenModule) => forbiddenModule.module === warning.module,
      ),
  );
  return { forbidden, warning: warningsWithoutErrors, config };
}
