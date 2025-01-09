// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { existsSync } from "fs";

import ejs from "ejs";
import emailValidator from "email-validator";
import { create as createMemFs } from "mem-fs";
import type { MemFsEditor } from "mem-fs-editor";
import { create as createEditor } from "mem-fs-editor";
import type { Logger } from "winston";

import { Checker } from "./Checker.js";
import type { CreatorOptions, TemplatesContext } from "./Creator.types.js";
import { LICENSE_FAQS } from "./License.js";
import type { SupportedLicense } from "./License.types.js";
import { createLogger, DEFAULT_LEVEL } from "./Logger.js";
import { packageResourcePath } from "./Paths.js";
import { RESOURCES } from "./Resources.js";
import type { Resource } from "./Resources.types.js";

/**
 * Class creating the scaffold resources
 */
export class Creator {
  private _checker: Checker;
  private _logger: Logger;
  private _logLevel: string;
  private _license: SupportedLicense;
  private _resourcesToOverwrite: Resource[] = [];
  private _templatesContext: TemplatesContext;
  private _overwrite?: boolean;

  /**
   * Constructor
   * @param options Options for the creator
   */
  constructor({
    log,
    license,
    copyrightHolder,
    projectName,
    projectDescription,
    overwrite,
    repositoryUrl,
    communityEmail,
  }: CreatorOptions) {
    this._logLevel = log || DEFAULT_LEVEL;
    this._logger = createLogger(log);
    this._license = license;
    this._overwrite = overwrite;
    this._checker = new Checker({ log });

    if (communityEmail && Creator.validateEmail(communityEmail) === false) {
      throw new Error("Invalid email");
    }

    if (Creator.validateRepositoryUrl(repositoryUrl) === false) {
      throw new Error("Invalid email");
    }

    this._templatesContext = {
      license,
      licenseFAQ: LICENSE_FAQS[license],
      projectName,
      projectDescription: projectDescription,
      copyrightHolder: copyrightHolder,
      repositoryUrl,
      communityEmail,
      year: new Date().getFullYear(),
    };
  }

  /** Validates an email */
  public static validateEmail(email: string): boolean {
    return emailValidator.validate(email);
  }

  /** Validates a repository url */
  public static validateRepositoryUrl(value: string): boolean {
    return /^http[s]?:\/\/.*(?<!\/)$/.test(value);
  }

  /**
   * Returns a list of existing resources
   */
  public getConflicts(silent = false) {
    if (silent) {
      this._logger.level = "error";
    }
    this._logger.verbose("Looking for conflicts");

    const conflicts = this._checker.getExistingResources(silent);

    this._logger.debug(`Found ${conflicts.length} conflicts`, conflicts);

    this._logger.level = this._logLevel;
    return conflicts;
  }

  /**
   * Set the resources to overwrite
   * @param resources The resources to overwrite
   */
  public setResourcesToOverwrite(resources: Resource[]) {
    this._resourcesToOverwrite = resources;
  }

  /**
   * Create the scaffold resources
   */
  public async create() {
    this._logger.info(`Creating opensource project resources with ${this._license} license`);
    if (this._resourcesToOverwrite.length > 0) {
      this._logger.debug("Resources to overwrite", {
        resources: this._resourcesToOverwrite,
      });
    }

    const memFs = createMemFs();
    const editor = createEditor(memFs);

    const createResourcesPromise = RESOURCES.map((resource) => {
      return this._createResource(resource, editor);
    });

    await Promise.all(createResourcesPromise);

    await editor.commit();

    this._logger.info("Project resources created successfully");
  }

  /**
   * Creates a resource
   * @param resource The resource to create
   * @param editor The MemFsEditor instance where the resource will be created
   */
  private async _createResource(resource: Resource, editor: MemFsEditor) {
    this._logger.verbose(`Creating ${resource.name}`);

    const fileExists = existsSync(resource.path);

    if (fileExists) {
      if (!this._overwrite && !this._resourcesToOverwrite.find((r) => r.path === resource.path)) {
        this._logger.warn(`${resource.name} already exists, skipping`);
        return;
      } else {
        this._logger.warn(`Overwriting ${resource.name} at ${resource.path}`);
      }
    }

    const origin = ejs.render(resource.origin, this._templatesContext);

    this._logger.debug(`Copying ${resource.name} from ${origin} to ${resource.path}`);

    await editor.copyTplAsync(packageResourcePath(origin), resource.path, this._templatesContext);
  }
}
