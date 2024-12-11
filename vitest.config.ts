import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			exclude: [
				'dist',
				'scripts',
				'src/**/*.spec.ts',
				'vitest.config.ts'
			]
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
});