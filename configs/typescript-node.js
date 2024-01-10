const base = require("./typescript-base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  env: {
    ...base.env,
    "es2020": true,
    browser: false,
    node: true,
  }
};
