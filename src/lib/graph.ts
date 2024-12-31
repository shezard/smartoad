import { askQuestion } from '$lib/ollama';

export type Graph = {
	nodes: {
		type: 'prompt' | 'basic';
		props: {
			exec: Exec;
		};
	}[];
	links: Link[];
};

export type Link = [number, number];

export type Exec = (value: string | null, index: number) => void | Promise<void>;

export function createGraph(nodeStates) {
	return {
		nodes: [
			{
				type: 'prompt',
				props: {
					exec: (value, index) => {
						nodeStates[index + 1] = {
							value: value
						};
					}
				}
			},
			{
				type: 'basic',
				props: {
					exec: (value, index) => {
						let text = '';
						return new Promise((resolve) => {
							askQuestion(
								value,
								(part: string) => {
									text += part;
								},
								() => {
									nodeStates[index + 1] = {
										value: text
									};
									resolve();
								}
							);
						});
					}
				}
			},
			{
				type: 'basic',
				props: {
					exec: (_, __) => {
						return Promise.resolve();
					}
				}
			},
			{
				type: 'basic',
				props: {
					exec: (_, __) => {
						return Promise.resolve();
					}
				}
			}
		],
		links: [
			[0, 1],
			[0, 2],
			[1, 3],
			[2, 3]
		]
	} satisfies Graph;
}
