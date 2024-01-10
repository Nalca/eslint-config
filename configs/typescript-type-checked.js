// Cette configuration nécessite de définir le projet dans la propriété "parserOptions"
const base = require("./typescript-base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [
    ...(base.extends || []),
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:sonarjs/recommended"
  ],
  plugins: [
    ...(base.plugins || []),
  ],
  rules: {
    ...base.rules,

    // @typescript-eslint
    "@typescript-eslint/prefer-readonly": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/consistent-type-exports": "warn",
    "@typescript-eslint/no-confusing-void-expression": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-unnecessary-condition": "off", // Trop exigeante.
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/prefer-includes": "warn",
    "@typescript-eslint/restrict-plus-operands": "warn",
    "@typescript-eslint/return-await": "warn",

    // @sonarjs
    "sonarjs/cognitive-complexity": "warn",
    "sonarjs/no-duplicate-string": "off", // Pas très compatible avec typescript en fait ...
    "sonarjs/no-duplicated-branches": "warn",
    "sonarjs/no-inverted-boolean-check": "warn",
    "sonarjs/no-small-switch": "warn",
    "sonarjs/prefer-immediate-return": "warn",
    "sonarjs/no-ignored-return": "warn",
    "sonarjs/no-redundant-jump": "off", // Gueule sur les return inutiles, mais ils sont parfois utiles pour informer
    "sonarjs/no-unused-collection": "warn",
    "sonarjs/prefer-single-boolean-return": "warn",
  },
  overrides: [
    ...(base.overrides || []),
    {
      // J'ai oublié pourquoi ...
      "files": "*.ts",
      "rules": {
        "no-return-await": "off",
      }
    }
  ]
};