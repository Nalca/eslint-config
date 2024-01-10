const base = require("./javascript-plugins");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  env: {
    "es6": true,
    "es2020": true,
    node: true,
    browser: false,
  }
};