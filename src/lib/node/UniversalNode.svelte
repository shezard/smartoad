<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle, Play, Circle } from 'lucide-svelte';
	import type { Link, NodeState } from '$lib/graph';
	import { askQuestion } from '$lib/ollama';
	import { fetchUrl } from '$lib/fetch';

	let lastValues: string[] = [];

	let {
		index,
		selectedNodeIndex = $bindable(),
		exec = $bindable(),
		type,
		values = $bindable(),
		nodeStates = $bindable(),
		links,
		inputs,
		outputs
	}: {
		index: number;
		selectedNodeIndex: number;
		exec: string;
		type: string;
		values: string[];
		nodeStates: NodeState[];
		links: Link[];
		inputs: number[];
		outputs: number[];
	} = $props();

	let isLoading = $state(false);

	$effect(callExec);

	function callExec() {
		if (!values.length || type === 'prompt') {
			return;
		}

		isLoading = true;
		execExec(index)
			?.then(() => {
				lastValues = values;
				isLoading = false;
			})
			.catch((e: unknown) => {
				// TODO : toast ?
				console.error(e);
			});
	}

	function execExec(index: number) {
		function getValue(stateIndex: number) {
			return values[stateIndex];
		}

		function setOutput(stateIndex: number, value: string) {
			const outputNodes = links
				.filter(([start, _]) => {
					return start === index;
				})
				.map(([_, end]) => {
					return end;
				});

			const targetNodeIndex = outputNodes[stateIndex];

			if (targetNodeIndex != null) {
				const inputNodes = links
					.filter(([_, end]) => {
						return end === targetNodeIndex;
					})
					.map(([start, _]) => {
						return start;
					});

				const targetStateIndex = inputNodes.indexOf(index);

				nodeStates[targetNodeIndex].values[targetStateIndex] = value;
			}
		}

		console.log(`return ${exec}`);

		return new Function(
			'index',
			'getValue',
			'setOutput',
			'askQuestion',
			'fetch',
			`return ${exec}`
		)(index, getValue, setOutput, askQuestion, fetchUrl)();
	}
</script>

<Card.Root
	id="node-{index}"
	class="cursor-pointer {index === selectedNodeIndex ? 'border-lime-200' : ''}"
	onclick={() => {
		selectedNodeIndex = index;
	}}
>
	<Card.Header>
		<Card.Title>
			<div class="inline-flex w-full items-center gap-2">
				<span class="capitalize">{type}</span>
				<span class="text-sm text-muted">{index}</span>
				<span class="ml-auto">
					{#each outputs as output}
						<Circle class="h-2 w-2" id="output-{index}-{output}" />
					{/each}
				</span>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			<div>
				{#each inputs as input}
					<Circle class="h-2 w-2" id="input-{index}-{input}" />
				{/each}
			</div>
		</div>
		<Button variant="outline" size="icon" onclick={() => !isLoading && execExec(index)}>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
