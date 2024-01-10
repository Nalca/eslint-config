const base = require("./configs/typescript-base");

module.exports = {
  ...base,
  env: {
    ...(base.env),
    es6: true,
    es2020: true,
    node: true,
    browser: false,
  }
};

