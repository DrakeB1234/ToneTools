<script lang="ts">
  import { scale, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import type { Snippet } from "svelte";

  let {
    isOpen = $bindable(false),
    children,
  }: {
    isOpen: boolean;
    children: Snippet;
  } = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      isOpen = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="popup-backdrop" transition:fade={{ duration: 200 }}>
    <div
      onmousedown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      tabindex="0"
      class="popup-animation-wrapper"
      transition:scale={{ duration: 300, start: 0.95, easing: cubicOut }}
    >
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .popup-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .popup-animation-wrapper {
    position: fixed;
    inset: 0;

    display: flex;
    flex-direction: column;

    padding: var(--space-8);
  }

  @media (min-width: 600px) {
    .popup-animation-wrapper {
      padding: var(--space-16);
    }
  }
</style>
