<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Exec, Graph } from '$lib/types/Graph';

	const {
		index,
		graph,
		exec
	}: { index: number; graph? : Graph, exec: Exec } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			Output Node
			<span class="text-sm text-muted">{index}</span>
		</Card.Title>
	</Card.Header>
	<Card.Content></Card.Content>
</Card.Root>
