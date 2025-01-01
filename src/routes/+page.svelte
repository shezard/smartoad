<script lang="ts">
	import { createGraph, type NodeState } from '$lib/graph';
	import canvas from '$lib/actions/canvas';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import UniversalNode from '$lib/node/UniversalNode.svelte';

	let nodeStates: NodeState[] = $state([]);

	function updater(updatedNodeStates: NodeState[]) {
		nodeStates = updatedNodeStates;
		return nodeStates;
	}

	let selectedNodeIndex = $state(0);

	const graph = createGraph(nodeStates, updater);
</script>

<div class="divide-y">
	<div class="m-4 flex flex-row items-center justify-items-center gap-2">
		<span class="text-2xl text-lime-200">Smartoad</span> 🐸 Graphing tool 🐸
	</div>
	<div class="grid h-screen w-full grid-cols-12 divide-x">
		<div class="relative col-start-1 col-end-11">
			<div class="m-4 grid grid-cols-10 gap-4">
				{#each graph.nodes as node, index}
					<UniversalNode
						{index}
						bind:selectedNodeIndex
						type={node.type}
						{...nodeStates[index]}
					/>
				{/each}
			</div>
			<canvas
				class="pointer-events-none absolute left-0 top-0 h-full w-full bg-transparent"
				use:canvas={graph}
			></canvas>
		</div>
		<div class="col-start-11 col-end-13">
			{#if nodeStates.length}
				<div class="m-4 flex flex-col gap-2">
					<div class="capitalize">
						{graph.nodes[selectedNodeIndex].type}
						<span class="text-sm text-muted">{selectedNodeIndex}</span>
					</div>
					<div>
						{#if graph.nodes[selectedNodeIndex].type === 'prompt'}
							<Textarea bind:value={nodeStates[selectedNodeIndex].values[0]} />
						{:else}
							{#each nodeStates[selectedNodeIndex].values as value}
								<div>
									{value}
								</div>
							{/each}
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						Exec
						<Textarea value={nodeStates[selectedNodeIndex].exec.toString()} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
