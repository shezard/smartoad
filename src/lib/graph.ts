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

	function getValue(index: number, stateIndex: number) {
		return nodeStates[index].values[stateIndex];
	}

	function setOutput(index: number, stateIndex: number, value: string) {
		const outputNodes = graph.links
			.filter(([start, _]) => {
				return start === index;
			})
			.map(([_, end]) => {
				return end;
			});

		const targetNodeIndex = outputNodes[stateIndex];

		if (targetNodeIndex != null) {
			const inputNodes = graph.links
				.filter(([_, end]) => {
					return end === targetNodeIndex;
				})
				.map(([start, _]) => {
					return start;
				});

			const targetStateIndex = inputNodes.indexOf(index);

			nodeStates[targetNodeIndex].values[targetStateIndex] = value;
		}
	}

	const initialExecs = [
		function f() {
			const value = getValue(index, 0);
			setOutput(index, 0, value);
			setOutput(index, 1, value);
		},
		function f() {
			let text = '';
			return new Promise<void>((resolve) => {
				const value = getValue(index, 0);
				askQuestion(
					value,
					(part: string) => {
						text += part;
					},
					() => {
						setOutput(index, 0, text);
						resolve();
					}
				);
			});
		},
		function f() {
			const value = getValue(index, 0);
			setOutput(index, 0, value);
			return Promise.resolve();
		},
		function f() {
			const value0 = getValue(index, 0);
			const value1 = getValue(index, 1);
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
