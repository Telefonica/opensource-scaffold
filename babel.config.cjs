// SPDX-FileCopyrightText: 2024 Telefónica Innovación Digital
// SPDX-License-Identifier: MIT

module.exports = (api) => {
  const isTest = api.env("test");
  if (isTest) {
    return {
      presets: [
        ["@babel/preset-env", { targets: { node: "current", esmodules: true } }],
        "@babel/preset-typescript",
      ],
      plugins: [
        "babel-plugin-transform-import-meta",
        [
          "module-resolver",
          {
            root: ["."],
            alias: {
              "@action": "./action",
              "@src": "./src",
            },
          },
        ],
      ],
    };
  }
};
