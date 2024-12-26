import { APIGatewayProxyEventV2 } from 'aws-lambda';

const api = (event: APIGatewayProxyEventV2) => {
	return {
		body: JSON.stringify(event),
		statusCode: 200
	};
};

export default api;
