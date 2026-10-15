<script lang="ts">
	import { onMount } from "svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
	import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
	import { midiService } from "$lib/midiservice/midiService.svelte";
	import { dev } from "$app/environment";
	import { RenderScan } from "svelte-render-scan";
	import { afterNavigate } from "$app/navigation";
	import { lastUsedService } from "$lib/data/lastUsedService.svelte";
	import { page } from "$app/state";
	import "$lib/assets/app.css";
	import "$lib/assets/button.css";

	let { children } = $props();

	onMount(() => {
		pianoAudioService.init();
		sfxAudioService.init();
		midiService.init();
	});

	afterNavigate(() => {
		lastUsedService.addLastUsed(page.url.pathname);
	});
</script>

<svelte:head>
	<link rel="icon" href="/icon-192x192.webp" />
	<title>Tone Tools</title>
</svelte:head>

{#if dev}
	<RenderScan />
{/if}

<Navbar />
{@render children()}
