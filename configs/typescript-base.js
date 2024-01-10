const base = require("./javascript-plugins");

/** @type {import("eslint").Linter.Config} */
module.exports = {
	...base,
	extends: [
		...(base.extends || []),
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/eslint-recommended"
	],
	plugins: [
		...(base.plugins || []),
		"@typescript-eslint",
	],
	parser: "@typescript-eslint/parser",
	/** @type {import("@typescript-eslint/experimental-utils").TSESLint.ParserOptions} */
	parserOptions: {
		"ecmaVersion": 2018,
		"sourceType": "module",
	},
	rules: {
		...base.rules,

		// Typescript
		// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
		"@typescript-eslint/ban-ts-comment": "warn",
		"@typescript-eslint/brace-style": "warn",
		"@typescript-eslint/explicit-module-boundary-types": ["warn", { "allowArgumentsExplicitlyTypedAsAny": true }],
		"@typescript-eslint/member-delimiter-style": "warn",
		"@typescript-eslint/method-signature-style": ["warn", "property"],
		"@typescript-eslint/no-confusing-non-null-assertion": "warn",
		"@typescript-eslint/no-dupe-class-members": "warn",
		"@typescript-eslint/no-empty-function": "warn",
		"@typescript-eslint/no-empty-interface": "warn",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-extra-semi": "warn",
		"@typescript-eslint/no-extraneous-class": "error",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-invalid-this": "warn",
		"@typescript-eslint/no-misused-new": "warn",
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-shadow": "warn",
		"@typescript-eslint/no-unsafe-assignment": "off", // Un peu trop chiant en pratique.
		"@typescript-eslint/no-unsafe-call": "off", // Trop précis
		"@typescript-eslint/no-unsafe-member-access": "off", // Trop précis
		"@typescript-eslint/no-unused-expressions": "warn",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/prefer-enum-initializers": "warn",
		"@typescript-eslint/prefer-for-of": "warn",
		"@typescript-eslint/prefer-ts-expect-error": "warn",
		"@typescript-eslint/quotes": ["warn", "double"],
		"@typescript-eslint/require-await": "off",
		"@typescript-eslint/semi": "warn",
		"@typescript-eslint/space-infix-ops": "warn",
		"@typescript-eslint/unbound-method": "off",
	},
	"overrides": [
		...(base.overrides || []),
		{
			// Ici on désactive les règles javascripts qui posent problèmes sur un fichier typescript
			"files": "*.ts",
			"rules": {
				// Regular eslint -- Des doublons
				"no-dupe-class-members": "off",
				"no-empty-function": "off",
				"no-extra-semi": "off",
				"brace-style": "off",
				"no-invalid-this": "off",
				"no-shadow": "off",
				"no-unused-expressions": "off",
				"no-unused-vars": "off",
				"semi": "off",
				"quotes": "off",

				// eslint-plugin-unicorn
				"unicorn/no-unreadable-iife": "off", // Typiquement, ce genre d'expression est utilisé pour imposer un type de retour.
				"unicorn/no-this-assignment": "off", // Doublon avec @typescript-eslint/no-this-alias
			}
		},
		{
			// Ici on désactive les règles typescripts qui posent problèmes sur un fichier javascript
			"files": "*.js",
			"rules": {
				"@typescript-eslint/no-var-requires": "off", // Les fichiers .js n'utilisent pas 'import' par défaut
				"@typescript-eslint/explicit-module-boundary-types": "off",
			}
		},
		{
			// Certaines règles n'ont pas de sens sur les fichiers de déclaration
			"files": "*.d.ts",
			"rules": {
				"@typescript-eslint/no-unused-vars": "off",
			}
		}
	],
	// On ne veut PAS garder les 'ignorePatterns' des règles js, qui ignore les .ts
	ignorePatterns: (base.ignorePatterns || []).filter(pattern => {
		if (pattern === "*.ts" || pattern === "*.d.ts") {
			return false;
		}
		return true;
	}),
};