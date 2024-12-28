let aborter = new AbortController();

export function abortQuestion() {
	aborter?.abort();
	aborter = new AbortController();
}

export async function askQuestion(
	prompt: string,
	onChunk: (part: string) => void,
	onDone: () => void
) {
	if (prompt === '') {
		throw new Error('Question is empty');
	}
	const url = 'http://localhost:11434/api/generate';
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
	const reader = response.body.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			onDone();
		}
		const apiResponse = new TextDecoder().decode(value);
		const parsedReponse = JSON.parse(apiResponse);
		onChunk(parsedReponse.response);
	}
}
