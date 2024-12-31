<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle, Play, Circle } from 'lucide-svelte';
	import type { Exec } from '$lib/graph';

	let {
		index,
		selectedNodeIndex = $bindable(),
		exec,
		value = $bindable()
	}: {
		index: number;
		selectedNodeIndex: number;
		exec: Exec;
		value: string;
	} = $props();

	let isLoading = $state(false);
</script>

<Card.Root
	id="node-{index}"
	class={index === selectedNodeIndex ? 'border-lime-200' : ''}
	onclick={() => {
		selectedNodeIndex = index;
	}}
>
	<Card.Header>
		<Card.Title>
			<div class="inline-flex w-full items-center gap-2">
				<span>Prompt Node</span>
				<span class="text-sm text-muted">{index}</span>
				<span class="ml-auto">
					<Circle class="h-2 w-2" id="output-{index}" />
				</span>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<!-- <Textarea bind:value></Textarea> -->
		<Button variant="outline" size="icon" onclick={() => !isLoading && exec(value, index)}>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
