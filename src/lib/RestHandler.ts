'use server'

interface RequestOptions {
	auth?: string;
	json?: boolean;
	queryParams?: any | {};
	throwOnFail?: boolean;
}

const baseUrl: string = process.env['API_BASE_URL'] || 'http://localhost:3000';
const serverSecret: string = process.env['SERVER_SECRET'] || 'nigga';
const ssl: boolean = !baseUrl.startsWith('http://');

function _formUrl(url: string, queryParams: any = {}): string {
	if (url.startsWith('/')) url = url.slice(1);

	let formedUrl = '';
	if (ssl) formedUrl += baseUrl;
	else formedUrl += `${baseUrl}:${process.env['API_PORT'] || 7000}`;

	formedUrl += `/${url}`;

	const queryKeys = Object.keys(queryParams);
	if (queryKeys.length) {
		formedUrl += '?';
		formedUrl += queryKeys
			.map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
			.join('&');
	}
	return formedUrl;
}

export async function get(url: string, options: RequestOptions = { json: true, auth: '', queryParams: {}, throwOnFail: false }): Promise<any> {
	if (url.startsWith('http')) throw new Error('Nigga dont include protocol info. Mention only the endpoint (ie "/client/nigga"');
	const requestUrl = _formUrl(url, options.queryParams);
	const res =  await fetch(requestUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${serverSecret}|${options.auth || ''}`,
		}
	});
	if (options.throwOnFail && !res.ok) throw new Error(`${res.status} - ${res.statusText}`);
	if (!options.json) return res;
	else return await res.json();
}

async function _bodiedRequest(url: string, method: 'POST' | 'PATCH' | 'PUT' | 'DELETE', body: any, options: RequestOptions = { json: true, auth: '', queryParams: {} }): Promise<any> {
	if (url.startsWith('http')) throw new Error('Nigga dont include protocol info. Mention only the endpoint (ie "/client/nigga"');
	const requestUrl = _formUrl(url, options.queryParams);

	const res = await fetch(requestUrl, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${serverSecret}|${options?.auth || ''}`
		},
		body: JSON.stringify(body),
	});
	if (!options.json) return res.ok;
	else return await res.json();
}

export async function post(url: string, body: any, options?: RequestOptions): Promise<any> {
	return await _bodiedRequest(url, 'POST', body, options);
}

export async function put(url: string, body: any, options?: RequestOptions): Promise<any> {
	return await _bodiedRequest(url, 'PUT', body, options);
}

export async function patch(url: string, body: any, options?: RequestOptions): Promise<any> {
	return await _bodiedRequest(url, 'PATCH', body, options);
}

export async function _delete(url: string, body: any, options?: RequestOptions): Promise<any> {
	return await _bodiedRequest(url, 'DELETE', body, options);
}