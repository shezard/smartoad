<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle, Play } from 'lucide-svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import type { Exec, Graph, Link } from '$lib/types/Graph';

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
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			Prompt Node
			<span class="text-sm text-muted">{index}</span>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<Textarea bind:value></Textarea>
		<Button variant="outline" size="icon" onclick={() => !isLoading && exec(value)}>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
