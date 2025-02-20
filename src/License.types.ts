// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

/**
 * The supported licenses in the scaffold
 */
export type SupportedLicense =
  | "MPL-2.0"
  | "Apache-2.0"
  | "MIT"
  | "AGPL-3.0-or-later"
  | "AGPL-3.0-only";

/**
 * The URLs to the FAQs for each license
 */
export type LicenseFAQs = Record<SupportedLicense, string>;
