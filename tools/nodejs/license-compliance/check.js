import { cwd } from "node:process";
import { resolve as pathResolve } from "node:path";
import { readFile } from "node:fs/promises";
import yaml from "yaml";
import licenseChecker from "license-checker";

const ROOT_DIR = cwd();

/**
 * Licenses configuration object
 * @typedef {object} ConfigurationLicenses
 * @property {string[]} allowed - List of allowed licenses
 * @property {string[]} warning - List of licenses that require special attention
 * @property {string[]} forbidden - List of forbidden licenses
 */

/**
 * Configuration object for the license-checker
 * @typedef {object} LicenseCheckerConfiguration
 * @property {boolean} excludePrivatePackages - Exclude private packages or not
 * @property {boolean} production - Only show production dependencies.
 * @property {boolean} development - Only show development dependencies.
 * @property {string} start - Path to start checking dependencies from
 * @property {boolean} unknown - Show unknown licenses
 * @property {boolean} onlyUnknown - Only list packages with unknown licenses
 * @property {boolean} exclude - Exclude modules which licenses are in the comma-separated list from the output
 * @property {boolean} relativeLicensePath - Output the relative license path
 * @property {string} failOn - fail (exit with code 1) on the first occurrence of the licenses of the semicolon-separated list
 * @property {string} onlyAllow - fail (exit with code 1) on the first occurrence of the licenses not in the semicolon-separated list
 * @property {string} packages - restrict output to the packages (package@version) in the semicolon-separated list
 * @property {string} excludePackages -  restrict output to the packages (package@version) not in the semicolon-separated list
 * @property {boolean} direct - look for direct dependencies only
 */

/**
 * License checker options by check type
 * @typedef {object} licenseCheckerOptions
 * @property {LicenseCheckerConfiguration} global - Common options for all checks
 * @property {LicenseCheckerConfiguration} warning - Options for licenses that require special attention
 * @property {LicenseCheckerConfiguration} forbidden - Options for forbidden licenses
 */

/**
 * Configuration object for license-compliance
 * @typedef {object} Configuration
 * @property {ConfigurationLicenses} licenses - Configuration for the licenses
 * @property {boolean} errorOnForbidden - Indicates whether to throw an error when a forbidden license is found
 * @property {boolean} errorOnWarning - Indicates whether to throw an error when a license that requires special attention is found
 * @property {licenseCheckerOptions} licenseCheckerOptions - Options for the license-checker by check type
 */

/**
 * Reads the license-check.config.yaml file
 * @returns {Promise<Configuration>} - Library configuration object
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
 * License checker result for one module
 * @typedef {object} licenseCheckerResult
 * @property {string} module - The module name
 * @property {string | string[]} licenses - The licenses used by the module
 * @property {string} repository - The repository URL
 * @property {string} publisher - The publisher of the module
 * @property {string} email - The email of the publisher
 * @property {string} path - The path to the module
 * @property {string} licenseFile - The path to the license file
 */

/**
 * Returns an array of packages using a license that is not in the exclusions, or is unknown
 * @param {string[]} exclusions - List of licenses to exclude
 * @param {Partial<LicenseCheckerConfiguration>} configuration - Options for the license-checker
 * @returns {Promise<licenseCheckerResult[]>} - List of packages using a license that is not in the exclusions
 */
async function checkLicensesExcluding(exclusions, configuration = {}) {
  return new Promise((resolve, reject) => {
    licenseChecker.init(
      {
        start: ROOT_DIR,
        // @ts-ignore The library typing says that requires an array, but it only works with a comma-separated string
        exclude: exclusions.join(","),
        relativeLicensePath: true,
        ...configuration,
      },
      (err, packages) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            Object.entries(packages).map(([moduleName, result]) => {
              const resultToReturn = {};
              resultToReturn.module = moduleName;
              resultToReturn.licenses = result.licenses || [];
              resultToReturn.repository = result.repository || "";
              resultToReturn.publisher = result.publisher || "";
              resultToReturn.email = result.email || "";
              resultToReturn.path = result.path || "";
              resultToReturn.licenseFile = result.licenseFile || "";

              return resultToReturn;
            }),
          );
        }
      },
    );
  });
}

/**
 * Returns an array of modules using a forbidden license
 * @param {Configuration} config - Configuration object for the library
 * @returns {Promise<licenseCheckerResult[]>} - Array of modules with forbidden licenses
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
 * @param {Configuration} config - Configuration object for the library
 * @returns {Promise<licenseCheckerResult[]>} - Array of modules with forbidden licenses
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
 * Check licenses result
 * @typedef {object} CheckLicensesResult
 * @property {licenseCheckerResult[]} forbidden - Modules using forbidden licenses
 * @property {licenseCheckerResult[]} warning - Modules using licenses that require special attention
 * @property {Configuration} config - The configuration object
 */

/**
 * Returns an object detailing which modules use forbidden licenses and which use licenses that require special attention
 * @returns {Promise<CheckLicensesResult>} Object containing errors and warnings properties, each with an array of modules, and the config object
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
