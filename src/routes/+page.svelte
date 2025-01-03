<script lang="ts">
	import { populateState, type NodeState, type Link, type Node } from '$lib/graph';
	import canvas from '$lib/actions/canvas';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import UniversalNode from '$lib/node/UniversalNode.svelte';

	import nodesData from '$lib/data/nodes.json';
	import linksData from '$lib/data/links.json';
	import CommandMenu from '$lib/components/CommandMenu.svelte';
	import { onMount } from 'svelte';

	let nodes: Node[] = [...nodesData];
	let links: Link[] = $state(linksData);

	let nodeStates: NodeState[] = $state([]);

	function getNodeStates() {
		return nodeStates;
	}

	let selectedNodeIndex = $state(0);

	function updater(updatedNodeStates: NodeState[]) {
		nodeStates = updatedNodeStates;
		return nodeStates;
	}

	function addPrompt() {
		nodes = [
			...nodes,
			{
				type: 'prompt',
				exec: ''
			}
		];
		populateState(nodes, nodeStates, links, updater);
	}

	function addBasic() {
		nodes = [
			...nodes,
			{
				type: 'basic',
				exec: ''
			}
		];
		populateState(nodes, nodeStates, links, updater);
	}

	onMount(() => {
		populateState(nodes, nodeStates, links, updater);
	});

	function updateInputLinks(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		let selectedOptions = Array.from(e.currentTarget.selectedOptions).map(({ value }) => value);

		let updatedLinks = links.filter(([_, end]) => {
			return end !== selectedNodeIndex;
		});

		updatedLinks = [
			...updatedLinks,
			...selectedOptions.map((index) => {
				return [Number(index), selectedNodeIndex] as Link;
			})
		];

		links = updatedLinks;

		const updatedNodeStates = nodeStates.map((nodeState, index) => {
			(nodeState.inputs = links
				.filter(([_, end]) => {
					return end === index;
				})
				.map(([start, _]) => {
					return start;
				})),
				(nodeState.outputs = links
					.filter(([start, _]) => {
						return start === index;
					})
					.map(([_, end]) => {
						return end;
					}));
			return nodeState;
		});

		nodeStates = updater(updatedNodeStates);
	}

	function updateOutputLinks(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		let selectedOptions = Array.from(e.currentTarget.selectedOptions).map(({ value }) => value);

		let updatedLinks = links.filter(([start, _]) => {
			return start !== selectedNodeIndex;
		});

		updatedLinks = [
			...updatedLinks,
			...selectedOptions.map((index) => {
				return [selectedNodeIndex, Number(index)] as Link;
			})
		];

		links = updatedLinks;

		const updatedNodeStates = nodeStates.map((nodeState, index) => {
			(nodeState.inputs = links
				.filter(([_, end]) => {
					return end === index;
				})
				.map(([start, _]) => {
					return start;
				})),
				(nodeState.outputs = links
					.filter(([start, _]) => {
						return start === index;
					})
					.map(([_, end]) => {
						return end;
					}));
			return nodeState;
		});

		nodeStates = updater(updatedNodeStates);
	}
</script>

<div class="divide-y">
	<div class="m-4 flex flex-row items-center justify-items-center gap-2">
		<span class="text-2xl text-lime-200">Smartoad</span> 🐸 Graphing tool 🐸
	</div>
	<div class="grid h-screen w-full grid-cols-12 divide-x">
		<div class="relative col-start-1 col-end-11">
			<div class="m-4 grid grid-cols-10 gap-4">
				{#each nodeStates as _, index}
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
				use:canvas={getNodeStates}
			></canvas>
		</div>
		<div class="col-start-11 col-end-13">
			{#if nodeStates.length}
				<div class="m-4 flex flex-col gap-2">
					<div class="flex items-center gap-2 capitalize">
						{nodeStates[selectedNodeIndex].type}
						<span class="text-sm text-muted">{selectedNodeIndex}</span>
						<span class="ml-auto">
							In:
							<select multiple onchange={updateInputLinks}>
								{#each nodeStates as _, index}
									<option
										value={index}
										selected={nodeStates[selectedNodeIndex].inputs.includes(
											index
										)}
										disabled={selectedNodeIndex === index}
									>
										{index}
									</option>
								{/each}
							</select>
							Out:
							<select multiple onchange={updateOutputLinks}>
								{#each nodeStates as _, index}
									<option
										value={index}
										selected={nodeStates[selectedNodeIndex].outputs.includes(
											index
										)}
										disabled={selectedNodeIndex === index}
									>
										{index}
									</option>
								{/each}
							</select>
						</span>
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

<CommandMenu {addPrompt} {addBasic} />
