// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "path";

import { run } from "@src/Cli";
import { packageResourcePath } from "@src/Paths";

describe("cli", () => {
  beforeAll(() => {
    jest.mocked(packageResourcePath).mockImplementation((resourcePath: string) => {
      return resolve(__dirname, "..", "..", "..", resourcePath);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw due to jest config option", async () => {
    await expect(run(true)).rejects.toThrow();
  });
});
