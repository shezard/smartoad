<script lang="ts">
	import { populateState, type NodeState, type Link, type Node } from '$lib/graph';
	import canvas from '$lib/actions/canvas';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import UniversalNode from '$lib/node/UniversalNode.svelte';

	const nodes: Node[] = [
		{
			type: 'prompt',
			exec: function () {
				const value = getValue(0);
				setOutput(0, value);
				setOutput(1, value);
			}
		},
		{
			type: 'basic',
			exec: function () {
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
			}
		},
		{
			type: 'basic',
			exec: function () {
				const value = getValue(0);
				setOutput(0, value);
				return Promise.resolve();
			}
		},
		{
			type: 'basic',
			exec: function () {
				const value0 = getValue(0);
				const value1 = getValue(1);
				return Promise.resolve();
			}
		}
	];

	let links: Link[] = $state([
		[0, 1],
		[0, 2],
		[1, 3],
		[2, 3]
	]);

	let nodeStates: NodeState[] = $state([]);

	function updater(updatedNodeStates: NodeState[]) {
		nodeStates = updatedNodeStates;
		return nodeStates;
	}

	let selectedNodeIndex = $state(0);

	populateState(nodes, nodeStates, links, updater);
</script>

<div class="divide-y">
	<div class="m-4 flex flex-row items-center justify-items-center gap-2">
		<span class="text-2xl text-lime-200">Smartoad</span> 🐸 Graphing tool 🐸
	</div>
	<div class="grid h-screen w-full grid-cols-12 divide-x">
		<div class="relative col-start-1 col-end-11">
			<div class="m-4 grid grid-cols-10 gap-4">
				{#each nodes as _, index}
					<UniversalNode
						{index}
						bind:selectedNodeIndex
						bind:nodeStates
						{...nodeStates[index]}
						{links}
					/>
				{/each}
			</div>
			<canvas
				class="pointer-events-none absolute left-0 top-0 h-full w-full bg-transparent"
				use:canvas={nodeStates}
			></canvas>
		</div>
		<div class="col-start-11 col-end-13">
			{#if nodeStates.length}
				<div class="m-4 flex flex-col gap-2">
					<div class="capitalize">
						{nodeStates[selectedNodeIndex].type}
						<span class="text-sm text-muted">{selectedNodeIndex}</span>
						{#if nodeStates[selectedNodeIndex].inputs.length}
							In: {nodeStates[selectedNodeIndex].inputs}
						{/if}
						{#if nodeStates[selectedNodeIndex].outputs.length}
							Out: {nodeStates[selectedNodeIndex].outputs}
						{/if}
					</div>
					<div>
						{#if nodeStates[selectedNodeIndex].type === 'prompt'}
							<Textarea bind:value={nodeStates[selectedNodeIndex].values[0]} />
						{:else}
							<div class="flex flex-col gap-2">
								{#each nodeStates[selectedNodeIndex].values as value}
									<Textarea {value} disabled />
								{/each}
							</div>
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						Exec
						<Textarea
							bind:value={nodeStates[selectedNodeIndex].exec}
							style="font-family:monospace"
							class="text-xs"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
