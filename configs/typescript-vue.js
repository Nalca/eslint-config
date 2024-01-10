// Cette configuration nécessite de définir le projet dans la propriété "parserOptions"
const base = require("./typescript-type-checked");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [
    ...(base.extends || []),
    "plugin:vue/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ...base.parserOptions,
		"parser": "@typescript-eslint/parser",
		"sourceType": "module",
		"extraFileExtensions": [
			".vue"
		],
	},
  plugins: [
    ...(base.plugins || []),
		"vue",
  ],
  rules: {
    ...base.rules,

    // Vuejs
    "vue/attributes-order": "off",
    "vue/block-lang": [ "warn", { "script": { "lang": "ts" } } ],
    "vue/component-definition-name-casing": [ "error", "kebab-case" ],
    "vue/first-attribute-linebreak": "off",
    "vue/html-button-has-type": "error",
    "vue/html-closing-bracket-newline": "off",
    "vue/match-component-file-name": "warn",
    "vue/max-attributes-per-line": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/next-tick-style": [ "warn", "promise" ],
    "vue/no-boolean-default": [ "warn", "default-false" ],
    "vue/no-child-content": "warn",
    "vue/no-invalid-model-keys": "error",
    "vue/no-multiple-objects-in-class": "warn",
    "vue/no-potential-component-option-typo": [ "warn", { "presets": [ "vue", "vue-router" ] } ],
    "vue/no-this-in-before-route-enter": "warn",
    "vue/no-unused-vars": "warn",
    "vue/no-use-computed-property-like-method": "error",
    "vue/no-useless-v-bind": "warn",
    "vue/no-v-text": "error",
    "vue/padding-line-between-blocks": "warn",
    "vue/prefer-import-from-vue": "warn",
    "vue/prefer-template": "warn",
    "vue/require-emit-validator": "warn",
    "vue/singleline-html-element-content-newline": "off",
    "vue/v-for-delimiter-style": [ "warn", "of" ],
    "vue/v-on-function-call": [ "warn", "always" ]
  },
  "overrides": (() => {
    const array = (base.overrides || []);

    // Les règles typescript s'appliquent aussi aux fichiers .vue, si on utilise cette configuration
    const entry = array.find(value => {
      return value.files === "*.ts" && Object.keys(value).length === 2 && "rules" in value;
    });
    if (!entry) {
      throw new Error("Aurait du trouver la règle.");
    }
    entry.files = [entry.files, "*.vue"];

    return array;
  })(),
};