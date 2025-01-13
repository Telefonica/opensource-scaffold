// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

import { Checker } from "@src/Checker";

describe("check", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return valid true", async () => {
    const checker = new Checker({ log: "error" });
    const result = await checker.check();

    expect(result.valid).toBe(true);
  });
});
