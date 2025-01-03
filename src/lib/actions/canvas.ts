import type { NodeState } from '$lib/graph';

function getXY(type: 'input' | 'output', firstIndex: number, secondIndex: number) {
	const rect = document
		.querySelector(`#${type}-${firstIndex}-${secondIndex}`)
		?.getBoundingClientRect();

	if (!rect) {
		throw new Error(`No rect found for ${type}-${firstIndex}-${secondIndex}`);
	}

	// TODO : need a better way to calculate offset
	return [rect.x - rect.width / 2 + 8, rect.y - rect.height / 2 - 56];
}

function update(context: CanvasRenderingContext2D, getNodeStates: () => NodeState[]) {
	requestAnimationFrame(() => {
		context.clearRect(0, 0, 2000, 2000);

		const nodeStates = getNodeStates();
		nodeStates.forEach((nodeState, index) => {
			nodeState.outputs.forEach((output) => {
				const [startX, startY] = getXY('output', index, output);
				const [endX, endY] = getXY('input', output, index);

				context.strokeStyle = '#fff';
				context.beginPath();
				context.moveTo(startX, startY);
				context.lineTo(endX, endY);
				context.closePath();
				context.stroke();
			});
		});

		update(context, getNodeStates);
	});
}

export default function canvas(element: HTMLCanvasElement, getNodeStates: () => NodeState[]) {
	const parentWidth = element.parentElement?.clientWidth ?? 0;
	const parentHeight = element.parentElement?.clientHeight ?? 0;

	element.setAttribute('width', parentWidth.toString());
	element.setAttribute('height', parentHeight.toString());
	const context = element.getContext('2d');

	if (!context) {
		throw new Error('No context found');
	}

	update(context, getNodeStates);
}
