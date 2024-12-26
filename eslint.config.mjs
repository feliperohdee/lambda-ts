import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['coverage', 'dist']
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}']
	},
	{
		languageOptions: {
			globals: globals.browser
		}
	},
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off'
		}
	}
];
