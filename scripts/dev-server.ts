import { APIGatewayProxyEventV2, APIGatewayEventRequestContextV2, APIGatewayProxyEventHeaders } from 'aws-lambda';
import chalk, { ChalkInstance } from 'chalk';
import http from 'http';

import { handler } from '@/index';

const PORT = 3000;

const formatTime = (ms: number): string => {
	if (ms < 1) {
		return chalk.magenta(`${(ms * 1000).toFixed(2)}µs`);
	}
	
	if (ms < 1000) {
		return chalk.cyan(`${ms.toFixed(2)}ms`);
	}

	return chalk.yellow(`${(ms / 1000).toFixed(2)}s`);
};

const generateRequestId = (): string => {
	return Math.random().toString(36).substring(2, 8);
};

const colorizeMethod = (method: string): string => {
	const colors: { [key: string]: ChalkInstance } = {
		GET: chalk.green,
		POST: chalk.yellow,
		PUT: chalk.blue,
		DELETE: chalk.red,
		PATCH: chalk.magenta
	};

	return (colors[method] || chalk.gray)(method.padEnd(6));
};

const server = http.createServer(async (req, res) => {
	const requestId = generateRequestId();
	const startTime = performance.now();
	const chunks: Buffer[] = [];

	console.log(`\n${chalk.gray('╭─')} ${chalk.gray(new Date().toISOString())} ${chalk.gray(`[${requestId}]`)}`);

	req.on('data', chunk => {
		chunks.push(chunk);
	});

	req.on('end', async () => {
		const url = new URL(req.url || '/', `http://${req.headers.host}`);

		if (url.pathname === '/favicon.ico') {
			res.writeHead(204);
			res.end();
			return;
		}

		console.log(
			`${chalk.gray('├')} ${colorizeMethod(req.method || 'GET')} ${chalk.white(url.pathname)}${url.search ? chalk.gray(url.search) : ''}`
		);

		const body = Buffer.concat(chunks).toString();

		if (body) {
			console.log(`${chalk.gray('├')} ${chalk.gray('Body:')} ${chalk.gray(body.substring(0, 100) + (body.length > 100 ? '...' : ''))}`);
		}

		const event: APIGatewayProxyEventV2 = {
			body,
			headers: req.headers as APIGatewayProxyEventHeaders,
			isBase64Encoded: false,
			queryStringParameters: Object.fromEntries(url.searchParams.entries()),
			rawPath: url.pathname,
			rawQueryString: url.searchParams.toString(),
			requestContext: {
				http: {
					method: req.method || 'GET',
					path: url.pathname,
					protocol: 'HTTP/1.1',
					sourceIp: req.socket.remoteAddress || '127.0.0.1',
					userAgent: req.headers['user-agent'] || ''
				}
			} as APIGatewayEventRequestContextV2,
			routeKey: `${req.method} ${url.pathname}`,
			version: '2.0'
		};

		try {
			const response = await handler(event);
			const endTime = performance.now();
			const duration = endTime - startTime;

			res.writeHead(response.statusCode!, {
				'content-type': 'application/json'
			});

			const statusColor = response.statusCode! < 400 ? chalk.green : chalk.red;
			console.log(`${chalk.gray('├')} ${statusColor(`${response.statusCode}`)} ${chalk.gray('in')} ${formatTime(duration)}`);

			res.end(response.body);
		} catch (err) {
			const endTime = performance.now();
			const duration = endTime - startTime;

			res.writeHead(500, {
				'content-type': 'application/json'
			});

			console.log(`${chalk.gray('├')} ${chalk.red('500')} ${chalk.gray('in')} ${formatTime(duration)}`);
			console.log(`${chalk.gray('├')} ${chalk.red('Error:')} ${chalk.red(err instanceof Error ? err.message : 'Unknown error')}`);

			res.end(
				JSON.stringify({
					error: 'Internal server error'
				})
			);
		}

		console.log(chalk.gray('╰─ End of request'));
	});
});

server.listen(PORT, () => {
	console.log(`${chalk.green('Development server')} running at ${chalk.cyan(`http://localhost:${PORT}`)}`);
});
