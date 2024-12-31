<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Circle, LoaderCircle, Play } from 'lucide-svelte';
	import type { Exec } from '$lib/graph';

	let lastValue: string | null = null;

	let {
		index,
		exec,
		value = $bindable()
	}: {
		index: number;
		exec: Exec;
		value: string;
	} = $props();

	let isLoading = $state(false);

	$effect(callExec);

	async function callExec() {
		// if (value === lastValue) { // Maybe we really need it, not sure yet
		// 	return;
		// }

		if (!value) {
			return;
		}

		isLoading = true;
		await exec(value, index);
		lastValue = value;
		isLoading = false;
	}
</script>

<Card.Root id="node-{index}">
	<Card.Header>
		<Card.Title>
            <div class="inline-flex w-full items-center gap-2">
				<span>Basic Node</span>
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
            Input: {value}
		</div>
		<Button variant="outline" size="icon" onclick={() => !isLoading && callExec()}>
			{#if isLoading}
				<LoaderCircle class="h-4 w-4 animate-spin" />
			{:else}
				<Play class="h-4 w-4" />
			{/if}
		</Button>
	</Card.Content>
</Card.Root>
