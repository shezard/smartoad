<script lang="ts">
	import Link from '$lib/Link.svelte';
	import BasicNode from '$lib/node/BasicNode.svelte';
	import PromptNode from '$lib/node/PromptNode.svelte';
	import type { Graph } from '$lib/types/Graph';

	let nodeStates = $state([
		{
			value: 'Your text',
			isLoading: false
		},
		{
			value: null,
			isLoading: false
		},
		{
			value: null,
			isLoading: false
		}
	]);

	const graph = {
		nodes: [
			{
				component: PromptNode,
				props: {
					exec: (value: string) => {
						console.log('prompt', value);
						nodeStates[1] = {
							isLoading: false,
							value: value
						};
					}
				}
			},
			{
				component: BasicNode,
				props: {
					exec: (value: string) => {
						console.log('basic', value);
						nodeStates[2] = {
							isLoading: false,
							value: value
						};
					}
				}
			}
		],
		links: [[0, 1]]
	} satisfies Graph;
</script>

<div class="container h-screen">
	<div class="flex flex-col gap-2">
		<div class="m-4 flex flex-row items-center justify-items-center gap-2">
			<span class="text-2xl text-lime-200">Assistoad</span> 🍄 Your personnal assistant 🍄
		</div>
	</div>
	<div class="grid h-full grid-cols-12">
		<div class="col-start-1 col-end-11">
			<pre>
                - une node output
                    - lien entre playable et output
                - Un left panel scrollable
                    - par default affiche le contenu de output
            </pre>
			<div class="m-4 flex flex-col gap-2">
				{#each graph.nodes as node, index}
					<node.component {index} {...node.props} {...nodeStates[index]} />
				{/each}
				{#each graph.links as [start, end]}
					<Link {start} {end} />
				{/each}
			</div>
		</div>
		<div class="col-start-11 col-end-13">
			Side panel
			<div>
				{nodeStates[nodeStates.length - 1].value}
			</div>
		</div>
	</div>
</div>
