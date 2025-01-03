export type Link = [number, number];

export type Exec = (index: number) => void | Promise<void>;

export type Node = {
	type: 'prompt' | 'basic';
	exec: string;
};

export type NodeState = {
	type: string;
	values: string[];
	exec: string;
	inputs: number[];
	outputs: number[];
};

export function populateState(
	nodes: Node[],
	nodeStates: NodeState[],
	links: Link[],
	updater: (nodeStates: NodeState[]) => NodeState[]
) {
	const initialNodeStates = nodes.map((node, index) => {
		return {
			type: node.type,
			values: [],
			exec: node.exec,
			inputs: links
				.filter(([_, end]) => {
					return end === index;
				})
				.map(([start, _]) => {
					return start;
				}),
			outputs: links
				.filter(([start, _]) => {
					return start === index;
				})
				.map(([_, end]) => {
					return end;
				})
		};
	});

	nodeStates = updater(initialNodeStates);
}
