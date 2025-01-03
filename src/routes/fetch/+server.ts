import { json, type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request, fetch }) => {
	const body = await request.json();

	async function fetchAndParse(url: string) {
		const response = await fetch(url);
		if (response == null || !response.ok) {
			throw new Error(`Unable to fetch ${url}`);
		}
		return (await response.text()).replaceAll('\\', '\\\\');
	}

	const res = await fetchAndParse(body.url);
	return json(res);
}) satisfies RequestHandler;
