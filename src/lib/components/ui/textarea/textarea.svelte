<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { TextareaEvents } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLTextareaAttributes;
	type $$Events = TextareaEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;
</script>

<div class="grow-wrap" data-replicated-value={value}>
	<textarea
		class={cn(
			'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input
		autocomplete="off"
		{...$$restProps}
	></textarea>
</div>

<style>
	.grow-wrap {
		/* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
		display: grid;
	}
	.grow-wrap::after {
		/* Note the weird space! Needed to preventy jumpy behavior */
		content: attr(data-replicated-value) ' ';

		/* This is how textarea text behaves */
		white-space: pre-wrap;

		/* Hidden from view, clicks, and screen readers */
		visibility: hidden;
	}
	.grow-wrap > textarea {
		/* You could leave this, but after a user resizes, then it ruins the auto sizing */
		resize: none;

		/* Firefox shows scrollbar on growth, you can hide like this. */
		overflow: hidden;
	}
	.grow-wrap > textarea,
	.grow-wrap::after {
		/* Identical styling required!! */
		padding: 0.5rem;
		font: inherit;

		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
	}
</style>
