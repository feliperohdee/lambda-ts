import esbuild from 'esbuild';

(async () => {
	try {
		await esbuild.build({
			bundle: true,
			entryPoints: ['src/index.ts'],
			external: ['aws-sdk'],
			minify: true,
			outdir: 'dist',
			platform: 'node',
			sourcemap: true,
			target: 'node22',
			alias: {
				'@': './src'
			}
		});
	} catch {
		process.exit(1);
	}
})();
