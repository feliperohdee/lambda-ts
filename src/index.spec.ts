import { describe, it, expect } from 'vitest';

import { handler } from '@/index';

describe('/index', () => {
	it('should return a response', async () => {
		const res = await handler({
			message: 'Hello world!'
		} as any);

		expect(res).toEqual({
			body: '{"message":"Hello world!"}',
			statusCode: 200
		});
	});
});
