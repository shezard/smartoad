<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle, Play } from 'lucide-svelte';
	import type { Exec } from '$lib/types/Graph';

	let lastValue: string | null = null;

	let {
		index,
		exec,
		isLoading,
		value = $bindable()
	}: {
		index: number;
		exec: Exec;
		isLoading: boolean;
		value: string;
	} = $props();

	$effect(() => {
		if (value === lastValue) {
			return;
		}

		exec(value);
		lastValue = value;
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			Basic Node
			<span class="text-sm text-muted">{index}</span>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		Input: {value}
		<Button variant="outline" size="icon" onclick={() => !isLoading && exec(value)}>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
