<script lang="ts">
	import { createGraph } from '$lib/graph';
	import grid from '$lib/actions/grid';
	import canvas from '$lib/actions/canvas';

	let nodeStates = $state([
		{
			value: 'Your text'
		},
		{
			value: null
		},
		{
			value: null
		}
	]);

	const graph = createGraph(nodeStates);
</script>

<div class="divide-y">
	<div class="m-4 flex flex-row items-center justify-items-center gap-2">
		<span class="text-2xl text-lime-200">Smartoad</span> 🐸 Graphing tool 🐸
	</div>
	<div class="grid h-screen w-full grid-cols-12 divide-x">
		<div class="relative col-start-1 col-end-11">
			<div class="grid-stack m-4" use:grid>
				{#each graph.nodes as node, index}
					<node.component {index} {...node.props} {...nodeStates[index]} />
				{/each}
			</div>
			<canvas
				class="pointer-events-none absolute left-0 top-0 h-full w-full bg-transparent"
				use:canvas={graph}
			></canvas>
		</div>
		<div class="col-start-11 col-end-13">
			<div class="m-4">
				Output
				<br />
				{nodeStates[nodeStates.length - 1].value}
			</div>
		</div>
	</div>
</div>
