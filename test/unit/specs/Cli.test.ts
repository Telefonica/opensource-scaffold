// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { run } from "@src/Cli";

describe("cli", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log", () => {
    const log = jest.spyOn(console, "log").mockImplementation();
    run();

    expect(log).toHaveBeenCalledWith(
      "Hello world! Creating an open source project will be easier with this CLI.",
    );
  });
});
