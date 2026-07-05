<script lang="ts">
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
  <div class="modal-backdrop">
    <div
      onmousedown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      tabindex="0"
      class="modal-animation-wrapper"
    >
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .modal-animation-wrapper {
    position: fixed;
    inset: 0;

    display: flex;
    flex-direction: column;

    padding: var(--space-8);
  }

  @media (min-width: 600px) {
    .modal-animation-wrapper {
      padding: var(--space-16);
    }
  }
</style>
