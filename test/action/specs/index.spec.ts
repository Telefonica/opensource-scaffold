// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: Apache-2.0

import * as main from "@action/main";

// Mock the action's entrypoint
const runMock = jest.spyOn(main, "run").mockImplementation();

describe("index", () => {
  it("calls run when imported", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../../action/index");

    expect(runMock).toHaveBeenCalled();
  });
});
