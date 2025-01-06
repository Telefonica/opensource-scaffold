// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
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

    jest.spyOn(core, "debug").mockImplementation();
    jest.spyOn(core, "info").mockImplementation();
    jest.spyOn(core, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
});
