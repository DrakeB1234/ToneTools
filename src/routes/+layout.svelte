<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/images/logo.svg" />
	<title>Music App</title>
</svelte:head>

<div class="app">
	<Sidebar />
	<div class="content-container">
		{@render children()}
	</div>
</div>

<style>
	.app {
		display: flex;
		min-height: 100dvh;
	}

	.content-container {
		flex: 1;
		min-width: 0;
	}

	@media (max-width: 768px) {
		.app {
			flex-direction: column;
		}
	}
</style>
