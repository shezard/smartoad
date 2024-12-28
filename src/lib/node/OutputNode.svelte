<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	const {
		index,
		links,
		exec
	}: { index: number; links: [number, number][]; exec: (value: string) => void } = $props();
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
