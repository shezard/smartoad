<script lang="ts">
	import Link from '$lib/Link.svelte';
	import BasicNode from '$lib/node/BasicNode.svelte';
	import PromptNode from '$lib/node/PromptNode.svelte';
	import type { Graph } from '$lib/types/Graph';

	let nodeStates = $state([
		{
			value: 'Your text'
		},
		{
			value: null
		},
		{
			value: null
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
							value: value
						};
					}
				}
			},
			{
				component: BasicNode,
				props: {
					exec: (value: string) => {
						return new Promise((resolve) => {
							setTimeout(() => {
								console.log('basic', value);
								nodeStates[2] = {
									value: value
								};
								resolve();
							}, 2000);
						});
					}
				}
			}
		],
		links: [[0, 1]]
	} satisfies Graph;
</script>

<div class="h-full divide-y">
	<div class="m-4 flex flex-row items-center justify-items-center gap-2">
		<span class="text-2xl text-lime-200">Smartoad</span> 🐸 Graphing tool 🐸
	</div>
	<div class="grid h-full grid-cols-12 divide-x">
		<div class="col-start-1 col-end-11">
			<div class="m-4 flex flex-col gap-4">
				{#each graph.nodes as node, index}
					<node.component {index} {...node.props} {...nodeStates[index]} />
				{/each}
				{#each graph.links as [start, end]}
					<Link {start} {end} />
				{/each}
			</div>
		</div>
		<div class="col-start-11 col-end-13">
			<div class="m-4">
				Side panel<br />
				{nodeStates[nodeStates.length - 1].value}
			</div>
		</div>
	</div>
</div>
