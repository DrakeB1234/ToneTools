<script lang="ts">
	import type { Snippet } from "svelte";
	import Button from "../components/UI/Button.svelte";
	import MidiDeviceConnect from "../components/MidiDeviceConnect.svelte";

	type Props = {
		handleExitClick: () => void;
		gameContainerMessage: string;
		gameContainerSnippet: Snippet;
		scoreContainerSnippet: Snippet;
		showMidiDevice?: boolean;
	};

	let {
		handleExitClick,
		gameContainerMessage,
		gameContainerSnippet,
		scoreContainerSnippet,
		showMidiDevice = false
	}: Props = $props();
</script>

<div class="top-container flex-row">
	<Button variant="outlined" onclick={handleExitClick}>Exit</Button>
	{#if showMidiDevice}
		<MidiDeviceConnect />
	{/if}
</div>

<div class="panel game-container space-above-sm">
	<div class="score-container">
		{@render scoreContainerSnippet()}
	</div>

	<div class="message-container space-above-sm">
		<p>{gameContainerMessage}</p>
	</div>

	{@render gameContainerSnippet()}
</div>

<style>
	.top-container {
		justify-content: space-between;
	}
	.game-container {
		padding: var(--space-16) var(--space-8);
	}
	.message-container {
		text-align: center;
	}
	.score-container {
		display: flex;
		justify-content: space-between;
		background-color: var(--color-bg-surface-1);
	}
	:global {
		.score-container .score-item {
			text-align: center;
		}

		.score-container .score-item.red > p {
			color: var(--color-bg-wrong);
		}
		.score-container .score-item.green > p {
			color: var(--color-bg-correct);
		}
	}
</style>
