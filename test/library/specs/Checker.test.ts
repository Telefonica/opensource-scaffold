// SPDX-FileCopyrightText: 2025 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import { existsSync } from "fs";

import { Checker } from "@src/Checker";

jest.mock<typeof import("fs")>("fs", () => ({
  ...jest.requireActual<typeof import("fs")>("fs"),
  existsSync: jest.fn().mockReturnValue(true),
}));

const RESOURCES_NUMBER = 14;

describe("check", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("when all resources exist", () => {
    it("should return valid true", async () => {
      const checker = new Checker({ log: "error" });
      const result = await checker.check();

      expect(result.valid).toBe(true);
    });
  });

  describe("when a resource does not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValueOnce(false);
    });

    it("should return valid false", async () => {
      const checker = new Checker();
      const result = await checker.check();

      expect(result.valid).toBe(false);
    });

    it("should return a message with the missing resource", async () => {
      const checker = new Checker({ log: "error" });
      const result = await checker.check();

      expect(result.report.message).toBe("1 missing resource: License file (LICENSE)");
    });
  });

  describe("when many resources do not exist", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockReturnValue(false);
    });

    it("should return a message with the missing resources", async () => {
      const checker = new Checker({ log: "error" });
      const result = await checker.check();

      expect(result.report.message).toEqual(
        expect.stringContaining(`${RESOURCES_NUMBER} missing resources:`),
      );
    });
  });

  describe("when ignoring certain resources", () => {
    beforeEach(() => {
      jest.mocked(existsSync).mockImplementation((path) => {
        return (
          !path.toString().includes("LICENSE") && !path.toString().includes("CODE_OF_CONDUCT.md")
        );
      });
    });

    it("should not report ignored resources as missing", async () => {
      const checker = new Checker({ log: "error", ignore: ["LICENSE"] });
      const result = await checker.check();

      expect(result.report.missing.map((r) => r.path)).not.toContain("LICENSE");
      expect(result.report.missing.map((r) => r.path)).toContain(".github/CODE_OF_CONDUCT.md");
    });

    it("should support glob patterns for ignoring resources", async () => {
      const checker = new Checker({ log: "error", ignore: ["**/*.md"] });
      const result = await checker.check();

      expect(result.report.missing.map((r) => r.path)).toContain("LICENSE");
      expect(result.report.missing.map((r) => r.path)).not.toContain(".github/CODE_OF_CONDUCT.md");
    });

    it("should support multiple ignore patterns", async () => {
      const checker = new Checker({ log: "error", ignore: ["LICENSE", "**/*.md"] });
      const result = await checker.check();

      expect(result.report.missing.map((r) => r.path)).not.toContain("LICENSE");
      expect(result.report.missing.map((r) => r.path)).not.toContain(".github/CODE_OF_CONDUCT.md");
    });

    it("should return valid true when all missing resources are ignored", async () => {
      jest.mocked(existsSync).mockReturnValue(false);

      const checker = new Checker({ log: "error", ignore: ["**/*"] });
      const result = await checker.check();

      expect(result.valid).toBe(true);
      expect(result.report.message).toBe("All resources exist");
      expect(result.report.missing).toHaveLength(0);
    });
  });
});
