import type { LogLevel } from "./Logger.types.js";
import type { Resource } from "./Resources.types.js";

/** Options for scaffold checker */
export interface CheckerOptions {
  /** Log level */
  log?: LogLevel;
}

export type ResourceReport = Omit<Resource, "origin">;
