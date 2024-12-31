import BasicNode from '$lib/node/BasicNode.svelte';
import PromptNode from '$lib/node/PromptNode.svelte';
import { askQuestion } from '$lib/ollama';

export type Graph = {
	nodes: {
		component: any;
		props: {
			exec: Exec;
		};
	}[];
	links: Link[];
};

export type Link = [number, number];

export type Exec = (value: string, index: number) => void | Promise<void>;

export function createGraph(nodeStates) {
	return {
		nodes: [
			{
				component: PromptNode,
				props: {
					exec: (value: string, index: number) => {
						nodeStates[index + 1] = {
							value: value
						};
					}
				}
			},
			{
				component: BasicNode,
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
			}
		],
		links: [[0, 1]]
	} satisfies Graph;
}
