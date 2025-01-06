// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { run } from "@src/Cli";

describe("cli", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw due to jest config option", async () => {
    await expect(run(true)).rejects.toThrow();
  });
});
