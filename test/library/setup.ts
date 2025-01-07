// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital and contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jest.mock<typeof import("chalk")>("chalk", () => ({
  gray: jest.fn().mockImplementation((text) => text),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jest.mock<typeof import("mem-fs")>("mem-fs", () => ({
  create: jest.fn().mockImplementation(),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jest.mock<typeof import("mem-fs-editor")>("mem-fs-editor", () => ({
  create: jest.fn().mockImplementation(),
  commit: jest.fn().mockImplementation(),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
jest.mock<typeof import("@src/Paths")>("@src/Paths", () => ({
  packageResourcePath: jest.fn().mockImplementation(),
}));
