export default async function grid(element: HTMLDivElement) {
	console.log(element.children);

	const { GridStack } = await import('gridstack');
	const grid = GridStack.init({
		disableResize: true
	});

	for (const node of element.children) {
		grid.makeWidget(node.id, { w: 3, h: 2 });
	}
}