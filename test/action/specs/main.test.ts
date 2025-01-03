// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import * as core from "@actions/core";

import * as main from "@action/main";

describe("action", () => {
  let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
  const runMock = jest.spyOn(main, "run");

  beforeEach(() => {
    jest.clearAllMocks();

    setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();

    jest.spyOn(core, "debug").mockImplementation();
    jest.spyOn(core, "info").mockImplementation();
    jest.spyOn(core, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log", () => {
    const log = jest.spyOn(console, "log").mockImplementation();
    main.run();

    expect(log).toHaveBeenCalledWith(
      "Hello world! This will check the opensource scaffold",
    );
  });

  describe("when any error occurs", () => {
    it("should set action as failed", async () => {
      jest.spyOn(console, "log").mockImplementation(() => {
        throw new Error("Foo error");
      });

      await main.run();

      expect(runMock).toHaveReturned();

      expect(setFailedMock).toHaveBeenNthCalledWith(1, "Foo error");
    });

    it("should not set action as failed if exception is not an error", async () => {
      jest.spyOn(console, "log").mockImplementation(() => {
        throw "this is not an error";
      });

      await main.run();

      expect(runMock).toHaveReturned();

      expect(setFailedMock).not.toHaveBeenCalled();
    });
  });
});
