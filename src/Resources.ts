import type { Resource } from "./Resources.types.js";

/**
 * List of open source scaffold resources
 */
export const RESOURCES: Resource[] = [
  {
    name: "License file",
    path: "LICENSE",
    origin: "templates/license-files/<%= license %>",
  },
  {
    name: "Readme file",
    path: "README.md",
    origin: "templates/README.md",
  },
];
