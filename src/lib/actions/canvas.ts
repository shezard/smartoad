import type { Graph } from "$lib/types/Graph";

function getXY(type: 'input'|'output', index: number) {
    const rect = document.querySelector(`#${type}-${index}`)?.getBoundingClientRect();

    if(!rect) {
        throw new Error(`No rect found for node-${index}`)
    }

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
            context.moveTo(startX, startY)
            context.lineTo(endX, endY);
            context.closePath();
            context.stroke();
        });

        update(context, graph);
    });
}

export default async function canvas(element: HTMLCanvasElement, graph: Graph) {

    element.setAttribute('width', element.parentElement?.clientWidth);
    element.setAttribute('height', element.parentElement?.clientHeight);
    const context = element.getContext('2d');

    if(!context) {
        throw new Error('No context found');
    }

    update(context, graph);
}
