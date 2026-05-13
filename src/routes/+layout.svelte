<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import Sidebar from "$lib/components/Sidebar.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
	<Sidebar />
	{@render children()}
</div>

<style>
	.page {
		display: flex;
	}
</style>
