<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		maxWidth = "app",
		children
	}: {
		maxWidth?: "app" | "homepage" | "desktopfull";
		children: Snippet;
	} = $props();
</script>

<div class="wrapper" style="max-width: var(--{maxWidth}-max-width);">
	{@render children()}
</div>

<style>
	.wrapper {
		margin-inline: auto;
	}
</style>
