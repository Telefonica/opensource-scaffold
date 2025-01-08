// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import type { SupportedLicense, LicenseFAQs } from "./License.types.js";

/**
 * The supported licenses in the scaffold
 */
export const SUPPORTED_LICENSES: SupportedLicense[] = [
  "MPL-2.0",
  "Apache-2.0",
  "MIT",
  "AGPL-3.0-or-later",
  "AGPL-3.0-only",
];

/**
 * The URLs to the FAQs for each license
 */
export const LICENSE_FAQS: LicenseFAQs = {
  "MPL-2.0": "https://www.mozilla.org/en-US/MPL/2.0/FAQ/",
  "Apache-2.0": "https://www.apache.org/foundation/license-faq.html",
  MIT: "https://opensource.org/licenses/MIT",
  "AGPL-3.0-or-later": "https://www.gnu.org/licenses/agpl-3.0.html",
  "AGPL-3.0-only": "https://www.gnu.org/licenses/agpl-3.0.html",
};
