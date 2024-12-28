<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import { Button } from '$lib/components/ui/button/index.js';
	import { LoaderCircle, Pause, Play } from 'lucide-svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import type { Exec, Graph, Link } from '$lib/types/Graph';

	const {
		index,
		graph,
		exec
	}: {
		index: number;
		graph: Graph;
		exec: Exec;
	} = $props();

	let value = $state('Some text');
    let isLoading = $state(false);

	async function setOutput(outputIndex: number, value: any) {
		const outputNodeIndex = getOutputNodeIndex(graph.links, index, outputIndex);
		if (!outputNodeIndex) {
			return;
		}

        isLoading = true;
		await graph.nodes[outputNodeIndex].props.exec(value);
        isLoading = false;
	};

	function getOutputNodeIndex(links: Link[], index: number, outputIndex: number) {
		const ownLinks = links.filter(([start, _]) => {
			return start === index;
		});

		if (ownLinks.length === 0) {
			return null;
		}

		const outputNodeIndexes = ownLinks.map(([_, end]) => {
			return end;
		});

		return outputNodeIndexes[outputIndex];
	}
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
		<Button variant="outline" size="icon" onclick={() => !isLoading && exec(value, setOutput)}>
            {#if isLoading}
                <LoaderCircle class="h-4 w-4 animate-spin" />
            {:else}
                <Play class="h-4 w-4" />
            {/if}
		</Button>
	</Card.Content>
</Card.Root>
