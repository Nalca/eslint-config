/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: [
    "eslint-plugin-tsdoc",
    "jsdoc"
  ],
  extends: [
    "plugin:jsdoc/recommended"
  ],
  settings: {
    "jsdoc": {
      "mode": "typescript"
    }
  },
  rules: {
    "jsdoc/require-throws": "warn",
    "tsdoc/syntax": "warn",
    "jsdoc/no-multi-asterisks": ["warn", {
      allowWhitespace: true
    }],
    "jsdoc/require-jsdoc": ["warn", {
      "require": {
        "ArrowFunctionExpression": false,
        "ClassDeclaration": false,
        "ClassExpression": false,
        "FunctionDeclaration": false,
        "FunctionExpression": false,
        "MethodDefinition": false
      },
      // Les noms des nodes de l'ast
      // Voir https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/typescript-estree/src/ts-estree/estree-to-ts-node-types.ts
      "contexts": [
        "MethodDefinition",
        "PropertyDefinition",
        "ClassDeclaration", // class FooBar ...
        "TSInterfaceDeclaration", // interface FooBar
        "TSTypeAliasDeclaration", // type FooBar
        "ExportNamedDeclaration",
        "TSEnumDeclaration",
        "TSEnumMember"
      ]
    }],
    "jsdoc/check-tag-names": ["warn", {
      "definedTags": [
        "remarks"
      ]
    }],
  },
  overrides: [
    {
      files: "*.ts",
      rules: {
        "jsdoc/require-param-type": "off", // Pas besoin avec typescript
        "jsdoc/require-returns-type": "off", // Pas besoin avec typescript
        "jsdoc/valid-types": "off" // Gère mal typescript (?)
      }
    },
    {
      // Ces règles ont des problèmes dans les .vue
      "files": "*.vue",
      "rules": {
        "jsdoc/require-throws": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-param": "off"
      }
    }
  ]
};