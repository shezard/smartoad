import { askQuestion } from '$lib/ollama';

export type Graph = {
	nodes: {
		type: 'prompt' | 'basic';
	}[];
	links: Link[];
};

export type Link = [number, number];

export type Exec = (index: number) => void | Promise<void>;

export type NodeState = { values: string[]; exec: string };

export function createGraph(
	nodeStates: NodeState[],
	updater: (nodeStates: NodeState[]) => NodeState[]
) {
	const graph = {
		nodes: [
			{
				type: 'prompt'
			},
			{
				type: 'basic'
			},
			{
				type: 'basic'
			},
			{
				type: 'basic'
			}
		],
		links: [
			[0, 1],
			[0, 2],
			[1, 3],
			[2, 3]
		]
	} satisfies Graph;

	const initialExecs = [
		function f() {
			const value = getValue(0);
			setOutput(0, value);
			setOutput(1, value);
		},
		function f() {
			let text = '';
			return new Promise<void>((resolve) => {
				const value = getValue(0);
				askQuestion(
					value,
					(part: string) => {
						text += part;
					},
					() => {
						setOutput(0, text);
						resolve();
					}
				);
			});
		},
		function f() {
			const value = getValue(0);
			setOutput(0, value);
			return Promise.resolve();
		},
		function f() {
			const value0 = getValue(0);
			const value1 = getValue(1);
			return Promise.resolve();
		}
	];

	const initialNodeStates = graph.nodes.map((_, index) => {
		return {
			values: [],
			exec: initialExecs[index].toString()
		};
	});

	nodeStates = updater(initialNodeStates);

	return graph;
}
