<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "../UI/Button.svelte";
  import MidiDeviceConnect from "../MidiDeviceConnect.svelte";

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
    showMidiDevice = false,
  }: Props = $props();
</script>

<div class="game-container__top flex-row">
  <Button variant="outlined" size="large" onclick={handleExitClick}>Exit</Button
  >
  {#if showMidiDevice}
    <MidiDeviceConnect />
  {/if}
</div>

<div class="game-container space-above-sm">
  <div class="message-container">
    <p>{gameContainerMessage}</p>
  </div>
  {@render gameContainerSnippet()}
</div>

<div class="score-container">
  {@render scoreContainerSnippet()}
</div>

<style>
  .game-container__top {
    justify-content: space-between;
  }
  .game-container {
    padding: var(--space-16) var(--space-8);
    border: 1px solid var(--color-border-subtle);
    background-color: var(--color-bg-surface-1);
  }
  .message-container {
    text-align: center;
  }
  .score-container {
    display: flex;
    justify-content: space-between;

    padding-top: var(--space-4);
    padding-bottom: var(--space-16);
  }
  :global {
    .score-item {
      text-align: center;
    }

    .score-item.red > p {
      color: var(--color-bg-danger);
    }
    .score-item.green > p {
      color: var(--color-bg-success);
    }
  }
</style>
