// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "path";

import { select, input, checkbox } from "@inquirer/prompts";
import { Command, Option } from "commander";

import { Checker } from "@src/Checker";
import { run, validateRepositoryUrl, validateEmail } from "@src/Cli";
import { Creator } from "@src/Creator";
import { packageResourcePath } from "@src/Paths";

jest.mock<typeof import("commander")>("commander", () => ({
  ...jest.requireActual<typeof import("commander")>("commander"),
  Command: jest.fn(),
  Option: jest.fn(),
}));

jest.mock<typeof import("@src/Checker")>("@src/Checker", () => ({
  Checker: jest.fn(),
}));

// @ts-expect-error We don't need to provide all properties
jest.mock<typeof import("@src/Creator")>("@src/Creator", () => ({
  Creator: jest.fn(),
}));

jest.mock<typeof import("@inquirer/prompts")>("@inquirer/prompts", () => ({
  ...jest.requireActual<typeof import("@inquirer/prompts")>("@inquirer/prompts"),
  select: jest.fn().mockReturnValue("MIT"),
  input: jest.fn().mockReturnValue("foo"),
  checkbox: jest.fn().mockReturnValue([]),
}));

type CommandCallback = (...args: Record<string, unknown>[]) => Promise<void>;

describe("cli", () => {
  let checkerCheckSpy: jest.SpyInstance;
  let creatorCreateSpy: jest.SpyInstance;
  let actionCallbacks: CommandCallback[];
  let validateRepositoryUrlSpy: jest.SpyInstance;
  let getConflictsSpy: jest.SpyInstance;
  let setResourcesToOverwriteSpy: jest.SpyInstance;
  let validateEmailSpy: jest.SpyInstance;

  beforeEach(() => {
    actionCallbacks = [];
    checkerCheckSpy = jest.fn().mockResolvedValue({
      valid: true,
    });
    creatorCreateSpy = jest.fn();
    validateRepositoryUrlSpy = jest.fn();
    validateEmailSpy = jest.fn();
    getConflictsSpy = jest.fn();
    setResourcesToOverwriteSpy = jest.fn();

    // @ts-expect-error We don't need to provide all properties
    jest.mocked(Checker).mockImplementation(() => {
      return {
        check: checkerCheckSpy,
      };
    });

    // @ts-expect-error We don't need to provide all properties
    jest.mocked(Creator).mockImplementation(() => {
      return {
        create: creatorCreateSpy,
        getConflicts: getConflictsSpy,
        setResourcesToOverwrite: setResourcesToOverwriteSpy,
      };
    });

    // @ts-expect-error We want to mock this static method
    Creator.validateRepositoryUrl = validateRepositoryUrlSpy;

    // @ts-expect-error We want to mock this static method
    Creator.validateEmail = validateEmailSpy;

    jest.mocked(packageResourcePath).mockImplementation((resourcePath: string) => {
      return resolve(__dirname, "..", "..", "..", resourcePath);
    });

    // @ts-expect-error We don't need to provide all properties
    jest.mocked(Option).mockImplementation(() => {
      return {
        choices: jest.fn().mockReturnThis(),
        default: jest.fn().mockReturnThis(),
      };
    });

    // @ts-expect-error We don't need to provide all properties
    jest.mocked(Command).mockImplementation(() => {
      return {
        name: jest.fn().mockReturnThis(),
        description: jest.fn().mockReturnThis(),
        command: jest.fn().mockReturnThis(),
        addOption: jest.fn().mockReturnThis(),
        showHelpAfterError: jest.fn().mockReturnThis(),
        parse: jest.fn().mockReturnThis(),
        action: jest.fn().mockImplementation((callback) => {
          actionCallbacks.push(callback);
        }),
      };
    });

    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("check action", () => {
    it("should not throw when check result is valid", async () => {
      await run();

      expect(jest.mocked(Command)).toHaveBeenCalledTimes(1);

      actionCallbacks[1]({
        log: "error",
      });

      expect(checkerCheckSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw when check result is invalid and exitOverride option is true", async () => {
      checkerCheckSpy.mockResolvedValue({
        valid: false,
        report: {
          message: "Some error",
        },
      });

      await run(true);

      await expect(
        actionCallbacks[1]({
          log: "error",
        }),
      ).rejects.toThrow("Some error");
    });

    it("should exit with code 1 when check result is invalid", async () => {
      checkerCheckSpy.mockResolvedValue({
        valid: false,
        report: {
          message: "Some error",
        },
      });

      await run();

      jest.spyOn(process, "exit").mockImplementation();

      await actionCallbacks[1]({
        log: "error",
      });

      expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1);
    });
  });

  describe("create action", () => {
    it("should throw when no name is provided and prompts are disabled", async () => {
      await run(true);

      await expect(
        actionCallbacks[0]({
          prompts: false,
        }),
      ).rejects.toThrow();
    });

    it("should exit process when validation fails and exitOverride is disabled", async () => {
      await run();

      jest.spyOn(process, "exit").mockImplementation();

      await actionCallbacks[0]({
        prompts: false,
      });

      expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1);
    });

    it("should throw when no license is provided and prompts are disabled", async () => {
      await run(true);

      await expect(
        actionCallbacks[0]({
          name: "test",
          prompts: false,
        }),
      ).rejects.toThrow();
    });

    it("should throw when no repo is provided and prompts are disabled", async () => {
      await run(true);

      await expect(
        actionCallbacks[0]({
          name: "test",
          license: "MIT",
          prompts: false,
        }),
      ).rejects.toThrow();
    });

    it("should throw when no copyright is provided and prompts are disabled", async () => {
      await run(true);

      await expect(
        actionCallbacks[0]({
          name: "test",
          license: "MIT",
          repo: "http://foo.com",
          prompts: false,
        }),
      ).rejects.toThrow();
    });

    it("should prompt for license when not provided", async () => {
      await run(true);

      await actionCallbacks[0]({
        log: "info",
        name: "test",
        copyright: "foo copyright",
        repo: "http://foo.com",
        description: "foo description",
        prompts: true,
        email: "foo@foo.com",
        overwrite: true,
      });

      expect(select).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Select a license" }),
      );

      expect(Creator).toHaveBeenCalledWith(expect.objectContaining({ license: "MIT" }));
    });

    it("should prompt for name when not provided", async () => {
      await run(true);

      jest.mocked(input).mockResolvedValue("foo name");

      await actionCallbacks[0]({
        log: "info",
        license: "MIT",
        repo: "http://foo.com",
        description: "foo description",
        prompts: true,
        email: "foo@foo.com",
        overwrite: true,
      });

      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Enter the project name" }),
      );

      expect(Creator).toHaveBeenCalledWith(expect.objectContaining({ projectName: "foo name" }));
    });

    it("should prompt for repo when not provided", async () => {
      await run(true);

      jest.mocked(input).mockResolvedValue("http://foo.com");

      await actionCallbacks[0]({
        log: "info",
        license: "MIT",
        name: "Foo name",
        description: "foo description",
        prompts: true,
        email: "foo@foo.com",
        overwrite: true,
      });

      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Enter the repository URL") }),
      );

      expect(Creator).toHaveBeenCalledWith(
        expect.objectContaining({ repositoryUrl: "http://foo.com" }),
      );
    });

    it("should return error message when creator.validateRepositoryUrl returns false", async () => {
      validateRepositoryUrlSpy.mockReturnValue(false);

      expect(validateRepositoryUrl("foo")).toEqual(
        expect.stringContaining("Invalid repository URL"),
      );
    });

    it("should return true when creator.validateRepositoryUrl returns true during repo url validation", async () => {
      validateRepositoryUrlSpy.mockReturnValue(true);

      expect(validateRepositoryUrl("foo")).toBe(true);
    });

    it("should prompt for description when not provided", async () => {
      await run(true);

      jest.mocked(input).mockResolvedValue("foo description");

      await actionCallbacks[0]({
        log: "info",
        license: "MIT",
        name: "Foo name",
        prompts: true,
        email: "foo@foo.com",
        overwrite: true,
      });

      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Enter the project description"),
        }),
      );

      expect(Creator).toHaveBeenCalledWith(
        expect.objectContaining({ projectDescription: "foo description" }),
      );
    });

    it("should prompt for email when not provided", async () => {
      await run(true);

      jest.mocked(input).mockResolvedValue("foo@foo.com");

      await actionCallbacks[0]({
        log: "info",
        license: "MIT",
        name: "Foo name",
        prompts: true,
        overwrite: true,
      });

      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Enter the community email"),
        }),
      );

      expect(Creator).toHaveBeenCalledWith(
        expect.objectContaining({ communityEmail: "foo@foo.com" }),
      );
    });

    it("should return error message when creator.validateEmail returns false", async () => {
      validateEmailSpy.mockReturnValue(false);

      expect(validateEmail("foo")).toEqual(expect.stringContaining("Invalid email"));
    });

    it("should return true when creator.validateEmail returns true during email validation", async () => {
      validateEmailSpy.mockReturnValue(true);

      expect(validateEmail("foo")).toBe(true);
    });

    it("should prompt for resources to overwrite when there are conflicts", async () => {
      getConflictsSpy.mockReturnValue([
        {
          name: "foo",
          value: "foo",
        },
      ]);

      jest.mocked(checkbox).mockResolvedValue(["foo"]);

      await run(true);

      await actionCallbacks[0]({
        log: "info",
        license: "MIT",
        name: "Foo name",
        prompts: true,
        overwrite: false,
      });

      expect(setResourcesToOverwriteSpy).toHaveBeenCalledWith(["foo"]);
    });

    it("should not prompt for resources to overwrite when there are no conflicts", async () => {
      getConflictsSpy.mockReturnValue([]);

      jest.mocked(checkbox).mockResolvedValue(["foo"]);

      await run(true);

      await actionCallbacks[0]({
        log: "info",
        license: "MIT",
        name: "Foo name",
        prompts: true,
        overwrite: false,
      });

      expect(setResourcesToOverwriteSpy).not.toHaveBeenCalled();
    });

    it("should not prompt and pass all options to creator when all options are provided", async () => {
      await run(true);

      await actionCallbacks[0]({
        log: "info",
        name: "test",
        license: "MIT",
        copyright: "foo copyright",
        repo: "http://foo.com",
        description: "foo description",
        email: "foo@foo.com",
        overwrite: false,
      });

      expect(Creator).toHaveBeenCalledWith({
        log: "info",
        license: "MIT",
        copyrightHolder: "foo copyright",
        projectName: "test",
        projectDescription: "foo description",
        repositoryUrl: "http://foo.com",
        communityEmail: "foo@foo.com",
        overwrite: false,
      });

      expect(creatorCreateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
