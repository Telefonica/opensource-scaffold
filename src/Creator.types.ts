import type { SupportedLicense } from "./License.types.js";
import type { LogLevel } from "./Logger.types.js";

/** Options for scaffold creator */
export interface CreatorOptions {
  /** Log level */
  log?: LogLevel;
  /** License type */
  license: SupportedLicense;
  /** The project name */
  projectName: string;
  /** The project description */
  projectDescription?: string;
  /** The project copyright owner */
  copyrightOwner?: string;
}

/** Context for templates */
export interface TemplatesContext {
  /** License type */
  license: SupportedLicense;
  /** License FAQ URL */
  licenseFAQ: string;
  /** The project name */
  projectName: string;
  /** The project description */
  projectDescription?: string;
  /** The project copyright owner */
  copyrightOwner?: string;
}
