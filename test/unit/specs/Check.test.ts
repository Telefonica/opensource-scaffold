// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { run } from "@src/Check";

describe("check", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log", () => {
    const log = jest.spyOn(console, "log").mockImplementation();
    run();

    expect(log).toHaveBeenCalledWith("Hello world! This will check the opensource scaffold");
  });
});
