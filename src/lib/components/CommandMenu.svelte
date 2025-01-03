<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import { onMount } from 'svelte';

	let isOpen = $state(false);

	let {
		addPrompt,
		addBasic
	}: {
		addPrompt: () => void;
		addBasic: () => void;
	} = $props();

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				isOpen = !isOpen;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<Command.Dialog bind:open={isOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Nodes">
			<Command.Item>
				<button
					onclick={() => {
						addPrompt();
						isOpen = false;
					}}
				>
					Add prompt node
				</button>
			</Command.Item>
			<Command.Item>
				<button
					onclick={() => {
						addBasic();
						isOpen = false;
					}}
				>
					Add basic node
				</button>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
