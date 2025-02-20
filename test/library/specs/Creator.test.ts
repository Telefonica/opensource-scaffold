// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import type { PathLike } from "fs";
import { existsSync } from "fs";

import { create as createEditor } from "mem-fs-editor";

import { Creator } from "@src/Creator";
import type { CreatorOptions } from "@src/Creator.types";

jest.mock<typeof import("fs")>("fs", () => ({
  ...jest.requireActual<typeof import("fs")>("fs"),
  existsSync: jest.fn().mockReturnValue(true),
}));

const RESOURCES_NUMBER = 14;

describe("creator", () => {
  let copyTplAsyncSpy: jest.SpyInstance;
  let commitSpy: jest.SpyInstance;
  const MOCK_DATA: CreatorOptions = {
    projectName: "foo name",
    projectDescription: "foo description",
    license: "MIT",
    repositoryUrl: "https://foo.com",
    log: "error",
  };

  beforeEach(() => {
    copyTplAsyncSpy = jest.fn().mockResolvedValue(undefined);
    commitSpy = jest.fn().mockResolvedValue(undefined);

    jest.mocked(createEditor).mockReturnValue({
      // @ts-expect-error Mocking the mem-fs-editor create function
      copyTplAsync: copyTplAsyncSpy,
      // @ts-expect-error Mocking the mem-fs-editor create function
      commit: commitSpy,
    });

    jest.mocked(existsSync).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("create", () => {
    describe("when email is invalid", () => {
      it("should throw an error", () => {
        expect(() => new Creator({ ...MOCK_DATA, communityEmail: "foo" })).toThrow(
          "Invalid email",
        );
      });
    });

    describe("when repository URL is invalid", () => {
      it("should throw an error", () => {
        expect(() => new Creator({ ...MOCK_DATA, repositoryUrl: "foo" })).toThrow(
          "Invalid repository URL",
        );
      });
    });

    describe("when any resource exists", () => {
      it("should create the resources", async () => {
        const creator = new Creator(MOCK_DATA);

        await creator.create();

        expect(copyTplAsyncSpy).toHaveBeenCalledTimes(RESOURCES_NUMBER);
        expect(commitSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("getConflicts method", () => {
      it("should return the resources that already exist", () => {
        jest.mocked(existsSync).mockImplementation((path: PathLike) => {
          return path.toString().includes("LICENSE");
        });

        const creator = new Creator(MOCK_DATA);

        expect(creator.getConflicts()).toEqual([
          {
            origin: "templates/license-files/<%= license %>",
            path: "LICENSE",
            name: "License file",
          },
        ]);
      });

      it("should not log when silent is true", () => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        const creator = new Creator({ ...MOCK_DATA, log: undefined });

        creator.getConflicts(true);

        // eslint-disable-next-line no-console
        expect(jest.mocked(console.log)).not.toHaveBeenCalled();
      });
    });

    describe("when some resource exists", () => {
      beforeEach(() => {
        jest.mocked(existsSync).mockImplementation((path: PathLike) => {
          return path.toString().includes("LICENSE");
        });
      });

      it("should not overwrite it", async () => {
        const creator = new Creator(MOCK_DATA);

        await creator.create();

        expect(copyTplAsyncSpy).toHaveBeenCalledTimes(RESOURCES_NUMBER - 1);
      });

      it("should overwrite it when overwrite is true", async () => {
        const creator = new Creator({ ...MOCK_DATA, overwrite: true });

        await creator.create();

        expect(copyTplAsyncSpy).toHaveBeenCalledTimes(RESOURCES_NUMBER);
      });

      it("should overwrite it when resources to overwrite are set", async () => {
        const creator = new Creator(MOCK_DATA);

        creator.setResourcesToOverwrite([{ origin: "", path: "LICENSE", name: "License file" }]);

        await creator.create();

        expect(copyTplAsyncSpy).toHaveBeenCalledTimes(RESOURCES_NUMBER);
      });
    });
  });
});
