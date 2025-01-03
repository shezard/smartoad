let aborter = new AbortController();

export function abortFetch() {
	aborter?.abort();
	aborter = new AbortController();
}

export async function fetchUrl(url: string | null) {
	if (url === null || url === '') {
		throw new Error('Url is empty');
	}
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			model: 'llama3.2',
			prompt: prompt
		}),
		signal: aborter.signal
	});
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
	}
	if (!response.body) {
		throw new Error('Readable stream not found in the response.');
	}

	return response.text();
}
