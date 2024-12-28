<script lang="ts">
	import BasicNode from '$lib/node/BasicNode.svelte';
	import PromptNode from '$lib/node/PromptNode.svelte';
	import { askQuestion } from '$lib/ollama';
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
					exec: (value: string, index: number) => {
						nodeStates[index + 1] = {
							value: value
						};
					}
				}
			},
			{
				component: BasicNode,
				props: {
					exec: (value, index) => {
						let text = '';
						return new Promise((resolve) => {
							askQuestion(
								value,
								(part: string) => {
									text += part;
								},
								() => {
									nodeStates[index + 1] = {
										value: text
									};
									resolve();
								}
							);
						});
					}
				}
			}
		],
		links: [[0, 1]]
	} satisfies Graph;
</script>

<div class="divide-y">
	<div class="m-4 flex flex-row items-center justify-items-center gap-2">
		<span class="text-2xl text-lime-200">Smartoad</span> 🐸 Graphing tool 🐸
	</div>
	<div class="grid grid-cols-12 divide-x">
		<div class="col-start-1 col-end-11">
			<div class="m-4 grid grid-cols-4 gap-4">
				{#each graph.nodes as node, index}
					<node.component {index} {...node.props} {...nodeStates[index]} />
				{/each}
			</div>
		</div>
		<div class="col-start-11 col-end-13">
			<div class="m-4">
				Output
				<br />
				{nodeStates[nodeStates.length - 1].value}
			</div>
		</div>
	</div>
</div>
