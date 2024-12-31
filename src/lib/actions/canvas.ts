import type { Graph } from '$lib/graph';

function getXY(type: 'input' | 'output', index: number) {
	const rect = document.querySelector(`#${type}-${index}`)?.getBoundingClientRect();

	if (!rect) {
		throw new Error(`No rect found for ${type}-${index}`);
	}

	// TODO : need a better way to calculate offset
	return [rect.x - rect.width / 2 + 8, rect.y - rect.height / 2 - 56];
}

function update(context: CanvasRenderingContext2D, graph: Graph) {
	requestAnimationFrame(() => {
		context.clearRect(0, 0, 2000, 2000);
		graph.links.forEach(([start, end]) => {
			const [startX, startY] = getXY('output', start);
			const [endX, endY] = getXY('input', end);

			context.strokeStyle = '#fff';
			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(endX, endY);
			context.closePath();
			context.stroke();
		});

		update(context, graph);
	});
}

export default function canvas(element: HTMLCanvasElement, graph: Graph) {
	const parentWidth = element.parentElement?.clientWidth ?? 0;
	const parentHeight = element.parentElement?.clientHeight ?? 0;

	element.setAttribute('width', parentWidth.toString());
	element.setAttribute('height', parentHeight.toString());
	const context = element.getContext('2d');

	if (!context) {
		throw new Error('No context found');
	}

	update(context, graph);
}
