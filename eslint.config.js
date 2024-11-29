import globals from "globals";
import pluginJs from "@eslint/js";
import json from "@eslint/json";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		plugins: {
			json,
		},
	},

	// lint JSON files
	{
		files: ["**/*.json"],
		language: "json/json",
		rules: {
			"json/no-duplicate-keys": "error",
		},
	},
	{
		files: ["**/*.js"],
		...pluginJs.configs.recommended,
	},
	{
		files: ["**/*.js"],
		languageOptions: { globals: globals.browser },
	},
];
