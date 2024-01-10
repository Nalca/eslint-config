const base = require("./javascript-base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [
    ...(base.extends || []),
    "plugin:promise/recommended",
    "plugin:unicorn/recommended",
    "plugin:import/recommended",
  ],
  plugins: [
    ...(base.plugins || []),
    "promise",
    "unicorn",
    "import",
  ],
  rules: {
    ...base.rules,

    // import
    "import/no-unresolved": "off", // Casse trop les couilles par défaut. A activer au cas par cas. (De toute façon, le bundler devrait couiner aussi)

    // eslint-plugin-unicorn
    "unicorn/better-regex": "warn",
    "unicorn/catch-error-name": "warn",
    "unicorn/consistent-destructuring": "off",
    "unicorn/consistent-function-scoping": "warn",
    "unicorn/empty-brace-spaces": "warn",
    "unicorn/explicit-length-check": "warn",
    "unicorn/filename-case": "off",
    "unicorn/no-array-for-each": "warn",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-await-expression-member": "warn",
    "unicorn/no-console-spaces": "warn",
    "unicorn/no-lonely-if": "warn",
    "unicorn/switch-case-braces": "warn",
    "unicorn/no-null": "off",
    "unicorn/no-thenable": "warn",
    "unicorn/no-this-assignment": "warn",
    "unicorn/no-unreadable-iife": "warn",
    "unicorn/no-useless-promise-resolve-reject": "warn",
    "unicorn/no-useless-switch-case": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/no-zero-fractions": "off",
    "unicorn/numeric-separators-style": "off",
    "unicorn/prefer-at": "warn",
    "unicorn/prefer-add-event-listener": "off",
    "unicorn/prefer-array-flat": "off", // Sorti l'avec l'ES2019 -> Trop récent.
    "unicorn/prefer-array-some": "warn",
    "unicorn/prefer-dom-node-append": "off",
    "unicorn/prefer-dom-node-text-content": "off",
    "unicorn/prefer-includes": "warn",
    "unicorn/prefer-json-parse-buffer": "warn",
    "unicorn/prefer-module": "off",
    "unicorn/prefer-native-coercion-functions": "off",
    "unicorn/prefer-node-protocol": "off", // A besoin de node v16 au minimum. On reste encore sur la v14 pour l'instant.
    "unicorn/prefer-number-properties": "warn",
    "unicorn/prefer-object-from-entries": "off",
    "unicorn/prefer-optional-catch-binding": "warn",
    "unicorn/prefer-query-selector": "warn",
    "unicorn/prefer-regexp-test": "warn",
    "unicorn/prefer-set-has": "warn",
    "unicorn/prefer-spread": "off",
    "unicorn/prefer-string-slice": "warn",
    "unicorn/prefer-ternary": "warn",
    "unicorn/relative-url-style": "warn",
    "unicorn/text-encoding-identifier-case": "warn",
    "unicorn/prevent-abbreviations": ["warn", {
      "ignore": [
        "[\\d]j$",
        "^createEl$",
        "^doc$",
        "^el$",
        "^i$",
        "^jQuery$", // Nom d'une librarie
        "^obj$",
        "^pkg",
        "^props$",
        "^str$",
        "^val$",
        "ComponentProps$",
        "ée[\\w]*$",
        "Props$",
      ]
    }]
  },
  "overrides": [
    {
      "files": "*.d.ts",
      "rules": {
        "unicorn/prefer-export-from": "off"
      }
    }
  ]
};