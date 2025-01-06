/**
 * Represents a resource of the Open Source scaffold
 */
export interface Resource {
  /** The friendly name for the resource */
  name: string;
  /** The path where the resource will be created */
  path: string;
  /** The path to the template of the resource */
  origin: string;
}
