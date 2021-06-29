module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'no-console': ['error', { allow: ['warn'] }],
		'no-unused-vars': 1,
		'no-inner-declarations': 1,
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
	},
};
