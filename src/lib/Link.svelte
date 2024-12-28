<script lang="ts">
	const { start, end } = $props();

	let width = $state(0);
	let height = $state(0);
	let startPos: [number, number] = $state([0, 0]);
	let endPos: [number, number] = $state([0, 0]);

	$effect(() => {
		// const startNode = document.querySelector(`#node-${start}`);
		// const endNode = document.querySelector(`#node-${end}`);
		// if (!startNode || !endNode) {
		// 	return;
		// }
		// startPos = getCenter(startNode.getBoundingClientRect());
		// endPos = getCenter(endNode.getBoundingClientRect());
		// [width, height] = getSize(startPos, endPos);
	});

	function getCenter(boundingRect: DOMRect): [number, number] {
		return [boundingRect.x + boundingRect.width / 2, boundingRect.y + boundingRect.height / 2];
	}

	function getSize(startPos: [number, number], endPos: [number, number]) {
		return [Math.max(startPos[0], endPos[0]), Math.max(startPos[1], endPos[1])];
	}
</script>

<!-- <svg class="absolute left-0 top-0" {width} {height}>
	<path d="M {startPos[0]} {startPos[1]} L {endPos[0]} {endPos[1]}" stroke="white" />
</svg> -->
