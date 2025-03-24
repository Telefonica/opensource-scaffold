// SPDX-FileCopyrightText: 2025 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import * as core from "@actions/core";

import * as main from "@action/main";
import { Checker } from "@src/Checker";

jest.mock<typeof import("@src/Checker")>("@src/Checker", () => {
  return {
    Checker: jest.fn().mockImplementation(() => {
      return {
        check: jest.fn(),
      };
    }),
  };
});

describe("action", () => {
  let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
  let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;
  let checkMock: jest.Mock;
  const runMock = jest.spyOn(main, "run");

  beforeEach(() => {
    jest.clearAllMocks();

    checkMock = jest.fn().mockResolvedValue({
      valid: true,
      report: {
        message: "All good",
        missing: [],
        found: [],
      },
    });

    // @ts-expect-error We don't want to mock the whole class, just the main method
    jest.mocked(Checker).mockImplementation(() => {
      return {
        check: checkMock,
      };
    });

    setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();
    setOutputMock = jest.spyOn(core, "setOutput").mockImplementation();

    jest.spyOn(core, "debug").mockImplementation();
    jest.spyOn(core, "info").mockImplementation();
    jest.spyOn(core, "error").mockImplementation();
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "log") return "info";
      return "";
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("log level", () => {
    it("should get value from input", () => {
      main.run();

      expect(core.getInput).toHaveBeenCalledWith("log");
      expect(jest.mocked(Checker)).toHaveBeenCalledWith(expect.objectContaining({ log: "info" }));
    });

    it("should pass undefined when input is not set", () => {
      jest.spyOn(core, "getInput").mockReturnValue("");

      main.run();

      expect(jest.mocked(Checker)).toHaveBeenCalledWith(
        expect.objectContaining({ log: undefined }),
      );
    });
  });

  describe("when check result is valid", () => {
    it("should set action output valid as true", async () => {
      await main.run();

      expect(setOutputMock).toHaveBeenNthCalledWith(1, "valid", "true");
      expect(setOutputMock).toHaveBeenNthCalledWith(
        2,
        "report",
        JSON.stringify({ message: "All good", missing: [], found: [] }),
      );
      expect(jest.mocked(core.info)).toHaveBeenCalledWith("All good");
    });
  });

  describe("when check result is invalid", () => {
    it("should set action output valid as false", async () => {
      checkMock.mockResolvedValue({
        valid: false,
        report: {
          message: "Some missing",
          missing: ["foo", "bar"],
          found: [],
        },
      });

      await main.run();

      expect(setOutputMock).toHaveBeenNthCalledWith(1, "valid", "false");
      expect(setOutputMock).toHaveBeenNthCalledWith(
        2,
        "report",
        JSON.stringify({ message: "Some missing", missing: ["foo", "bar"], found: [] }),
      );
      expect(jest.mocked(core.error)).toHaveBeenCalledWith("Some missing");
    });
  });

  describe("when any error occurs", () => {
    it("should set action as failed", async () => {
      checkMock.mockRejectedValue(new Error("Foo error"));

      await main.run();

      expect(runMock).toHaveReturned();

      expect(setFailedMock).toHaveBeenNthCalledWith(1, "Foo error");
    });

    it("should not set action as failed if exception is not an error", async () => {
      checkMock.mockRejectedValue("Foo error");

      await main.run();

      expect(runMock).toHaveReturned();

      expect(setFailedMock).not.toHaveBeenCalled();
    });
  });

  describe("ignore option", () => {
    let mockCheckerInstance: jest.Mocked<Checker>;
    let mockCheckMethod: jest.SpyInstance;
    const returnIgnore = (ignore: string) => {
      jest.spyOn(core, "getInput").mockImplementation((name: string) => {
        if (name === "log") return "info";
        if (name === "ignore") return ignore;
        return "";
      });
    };

    beforeEach(() => {
      mockCheckMethod = jest.fn().mockResolvedValue({ valid: true });
      mockCheckerInstance = {
        check: mockCheckMethod,
      } as unknown as jest.Mocked<Checker>;

      jest.mocked(Checker).mockImplementation(() => mockCheckerInstance);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should pass single ignore pattern to Checker", async () => {
      returnIgnore("CHANGELOG.md");

      await main.run();

      expect(Checker).toHaveBeenCalledWith(
        expect.objectContaining({
          ignore: ["CHANGELOG.md"],
        }),
      );

      expect(mockCheckMethod).toHaveBeenCalled();
    });

    it("should handle multiple patterns separated by semicolon", async () => {
      returnIgnore("CHANGELOG.md;.github/ISSUE_TEMPLATE/**");

      await main.run();

      expect(Checker).toHaveBeenCalledWith(
        expect.objectContaining({
          ignore: ["CHANGELOG.md", ".github/ISSUE_TEMPLATE/**"],
        }),
      );
    });

    it("should not pass ignore option when not provided", async () => {
      await main.run();

      expect(Checker).toHaveBeenCalledWith(
        expect.not.objectContaining({
          ignore: expect.anything(),
        }),
      );
    });

    it("should handle empty ignore option", async () => {
      returnIgnore("");

      await main.run();

      expect(Checker).toHaveBeenCalledWith(
        expect.not.objectContaining({
          ignore: expect.anything(),
        }),
      );
    });

    it("should handle whitespace in ignore patterns", async () => {
      returnIgnore(" CHANGELOG.md ; .github/ISSUE_TEMPLATE/** ");

      await main.run();

      expect(Checker).toHaveBeenCalledWith(
        expect.objectContaining({
          ignore: ["CHANGELOG.md", ".github/ISSUE_TEMPLATE/**"],
        }),
      );
    });
  });
});
