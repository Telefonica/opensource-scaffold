// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "path";

const _dirname = import.meta.dirname;

/**
 * Resolve the path of a package resource, from the package root
 * @param resourcePath The path of the resource
 * @returns The resolved path
 */
export function packageResourcePath(resourcePath: string) {
  return resolve(_dirname, "..", resourcePath);
}
