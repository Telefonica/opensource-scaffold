// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { select, checkbox, input } from "@inquirer/prompts";
import { Command, Option } from "commander";

import { Creator } from "./Creator.js";
import { SUPPORTED_LICENSES } from "./License.js";
import type { SupportedLicense } from "./License.types.js";
import { LOG_LEVELS } from "./Logger.js";
import type { LogLevel } from "./Logger.types.js";
import type { Resource } from "./Resources.types.js";

/**
 * Run the CLI
 * @param exitOverride Enable exit override, for testing purposes
 */
export async function run(exitOverride?: boolean): Promise<void> {
  const program = new Command();

  program
    .name("OpenSource Scaffold")
    .description("CLI to create or check open source project scaffolding")
    .addOption(new Option("--log <log>", "Log level").choices(LOG_LEVELS).default("info"));

  if (exitOverride) {
    program.exitOverride();
  }

  program
    .command("create")
    .description("Create scaffold resources")
    .addOption(new Option("-l, --license <license>", "License type").choices(SUPPORTED_LICENSES))
    .showHelpAfterError()
    .action(async (options) => {
      let license: SupportedLicense = options.license;
      let resourcesToOverwrite: Resource[] = [];

      if (!license) {
        license = (await select({
          message: "Select a license",
          choices: SUPPORTED_LICENSES.map((supportedLicense) => ({
            name: supportedLicense,
            value: supportedLicense,
          })),
        })) as SupportedLicense;
      }

      // TODO: Option --no-prompts. If no prompts is passed, check mandatory options and throw error if not present

      // TODO: Get also from options
      const projectName = await input({
        message: "Enter the project name",
        required: true,
      });

      // TODO: Get also from options
      const projectDescription = await input({
        message: "Enter the project description (optional)",
        required: false,
      });

      // TODO: Get also from options
      const copyrightOwner = await input({
        message: "Enter the project copyright owner (optional)",
        required: false,
      });

      const creator = new Creator({
        log: options.log as LogLevel,
        license,
        projectName,
        projectDescription,
        copyrightOwner,
      });

      // TODO: Option --overwrite
      const conflicts = creator.getConflicts(true);

      if (conflicts.length > 0) {
        resourcesToOverwrite = (await checkbox({
          message: "Next files already exist. Select those you want to overwrite",
          choices: conflicts.map((resource) => ({
            name: resource.name,
            value: resource,
          })),
        })) as Resource[];

        creator.setResourcesToOverwrite(resourcesToOverwrite);
      }

      await creator.create();
    });

  program.parse();
}
