<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle, Play, Circle } from 'lucide-svelte';
	import type { Exec } from '$lib/graph';

	let lastValue: string | null = null;

	let {
		index,
		selectedNodeIndex = $bindable(),
		exec,
		type,
		value = $bindable()
	}: {
		index: number;
		selectedNodeIndex: number;
		exec: Exec;
		type: string;
		value: string | null;
	} = $props();

	let isLoading = $state(false);

	$effect(callExec);

	function callExec() {
		if (!value || type === 'prompt') {
			return;
		}

		isLoading = true;
		exec(value, index)
			?.then(() => {
				lastValue = value;
				isLoading = false;
			})
			.catch((e) => {
				// TODO : toast ?
				console.error(e);
			});
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
					<Circle class="h-2 w-2" id="output-{index}" />
				</span>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			<div>
				<Circle class="h-2 w-2" id="input-{index}" />
			</div>
		</div>
		<Button variant="outline" size="icon" onclick={() => !isLoading && exec(value, index)}>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
