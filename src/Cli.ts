// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { select, checkbox, input } from "@inquirer/prompts";
import { Command, Option } from "commander";

import { Checker } from "./Checker.js";
import { Creator } from "./Creator.js";
import { SUPPORTED_LICENSES } from "./License.js";
import type { SupportedLicense } from "./License.types.js";
import { LOG_LEVELS } from "./Logger.js";
import type { LogLevel } from "./Logger.types.js";
import type { Resource } from "./Resources.types.js";

/**
 * Create scaffold resources
 * @param options Options from commander
 */
export async function check(options: {
  /** Log level */
  log?: LogLevel;
  /** When true, an error will be thrown instead of exiting process. Useful for testing purposes */
  exitOverride: boolean;
}): Promise<void> {
  const checker = new Checker({
    log: options.log,
  });

  const result = await checker.check();

  if (!result.valid) {
    if (options.exitOverride) {
      throw new Error(result.report.message);
    } else {
      const missing = result.report.missing.length;
      console.error(`Check failed: ${missing} missing resource${missing > 1 ? "s" : ""}`);
      process.exit(1);
    }
  }
}

/**
 * Create scaffold resources
 * @param options Options from commander
 */
export async function create(options: {
  /** License type */
  license?: SupportedLicense;
  /** Log level */
  log?: LogLevel;
  /** Project name */
  name?: string;
  /** Project description */
  description?: string;
  /** Project copyright holder */
  copyright?: string;
  /** Repository URL */
  repo?: string;
  /** Community email */
  email?: string;
  /** Overwrite existing files */
  overwrite?: boolean;
  /** Enable prompts or not */
  prompts: boolean;
  /** When true, an error will be thrown instead of exiting process. Useful for testing purposes */
  exitOverride: boolean;
}): Promise<void> {
  const overwrite = options.overwrite;
  let license = options.license;
  let resourcesToOverwrite: Resource[] = [];
  let projectName = options.name;
  let projectDescription = options.description;
  let copyrightHolder = options.copyright;
  let repo = options.repo;
  let email = options.email;

  function validationError(message: string) {
    if (options.exitOverride) {
      throw new Error(message);
    } else {
      console.error(message);
      process.exit(1);
    }
  }

  if (!projectName && !options.prompts) {
    validationError(
      "Project name is required. Please provide it using the --name option or enable prompts",
    );
  }

  if (!license && !options.prompts) {
    validationError(
      "License is required. Please provide it using the --license option or enable prompts",
    );
  }

  if (!repo && !options.prompts) {
    validationError(
      "Repo URL is required. Please provide it using the --repo option or enable prompts",
    );
  }

  if (!license && options.prompts) {
    license = (await select({
      message: "Select a license",
      choices: SUPPORTED_LICENSES.map((supportedLicense) => ({
        name: supportedLicense,
        value: supportedLicense,
      })).sort((a, b) => a.name.localeCompare(b.name)),
    })) as SupportedLicense;
  }

  if (!projectName && options.prompts) {
    projectName = await input({
      message: "Enter the project name",
      required: true,
    });
  }

  if (!copyrightHolder && options.prompts) {
    copyrightHolder = await input({
      message: "Enter the project copyright holder",
      required: true,
    });
  }

  if (!repo && options.prompts) {
    repo = await input({
      message:
        "Enter the repository URL, including the protocol and without the trailing slash (https://github.com/owner/repo)",
      required: false,
      validate: (value) => {
        if (!Creator.validateRepositoryUrl(value)) {
          return "Invalid repository URL. It should include the protocol and don't have a trailing slash";
        }
        return true;
      },
    });
  }

  if (!projectDescription && options.prompts) {
    projectDescription = await input({
      message: "Enter the project description (optional)",
      required: false,
    });
  }

  if (!email && options.prompts) {
    email = await input({
      message: "Enter the community email (optional)",
      required: false,
      validate: (value) => {
        if (value.length && !Creator.validateEmail(value)) {
          return "Invalid email";
        }
        return true;
      },
    });
  }

  const creator = new Creator({
    log: options.log,
    license: license!,
    projectName: projectName!,
    projectDescription,
    copyrightHolder,
    overwrite,
    repositoryUrl: repo!,
    communityEmail: email,
  });

  if (!overwrite && options.prompts) {
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
  }

  await creator.create();
}

/**
 * Run the CLI
 * @param exitOverride Enable exit override, for testing purposes
 */
export async function run(exitOverride?: boolean): Promise<void> {
  const program = new Command();

  program
    .name("Open Source Scaffold")
    .description("CLI to create or check open source project scaffolding");

  if (exitOverride) {
    program.exitOverride();
  }

  program
    .command("create")
    .description("Create scaffold resources")
    .addOption(new Option("--log <log>", "Log level").choices(LOG_LEVELS).default("info"))
    .addOption(new Option("-l, --license <license>", "License type").choices(SUPPORTED_LICENSES))
    .addOption(new Option("-n, --name <name>", "Project name"))
    .addOption(new Option("-d, --description <description>", "Project description"))
    .addOption(new Option("-c, --copyright <copyright>", "Copyright"))
    .addOption(new Option("-r, --repo <repo>", "Repository URL"))
    .addOption(new Option("-e, --email <email>", "Community email"))
    .addOption(new Option("--overwrite", "Overwrite existing files"))
    .addOption(new Option("--no-prompts", "Disable prompts"))
    .showHelpAfterError()
    .action(async (options) => {
      await create({
        ...options,
        exitOverride,
      });
    });

  program
    .command("check")
    .description("Check scaffold resources")
    .addOption(new Option("--log <log>", "Log level").choices(LOG_LEVELS).default("info"))
    .showHelpAfterError()
    .action(async (options) => {
      await check({
        ...options,
        exitOverride,
      });
    });

  program.parse();
}
