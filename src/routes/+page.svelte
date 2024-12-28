<script lang="ts">
	import Link from '$lib/Link.svelte';
	import OutputNode from '$lib/node/OutputNode.svelte';
	import PromptNode from '$lib/node/PromptNode.svelte';
	import type { Graph } from '$lib/types/Graph';

	let output = $state('');

	const graph = {
		nodes: [
			{
				component: PromptNode,
				props: {
					exec: (value: string, setOutput: (index: number, value: any) => void) =>
						setOutput(0, value)
				}
			},
			{
				component: OutputNode,
				props: {
					exec: (value: string) => {
						output = value;
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
                - Un header
                - Un space pour les nodes
                    - une node playable
                        - quand j'appuis sur play -> j'exec et je passe a la node suivante
                    - une node output
                    - lien entre playable et output
                - Un left panel scrollable
                    - par default affiche le contenu de output
            </pre>
			<div class="m-4 flex flex-col gap-2">
				{#each graph.nodes as node, index}
					<node.component {index} {graph} {...node.props} />
				{/each}
				{#each graph.links as [start, end]}
					<Link {start} {end} />
				{/each}
			</div>
		</div>
		<div class="col-start-11 col-end-13">
			Side panel
			<div>
				{output}
			</div>
		</div>
	</div>
</div>
