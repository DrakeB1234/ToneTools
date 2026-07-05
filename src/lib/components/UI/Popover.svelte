<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    id: string;
    children: Snippet;
    placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
    ref?: HTMLElement;
    [key: string]: any;
  };

  let {
    id,
    children,
    placement = "bottom-start",
    ref = $bindable(),
    ...rest
  }: Props = $props();
</script>

<div
  bind:this={ref}
  {id}
  popover="auto"
  class="popover-panel"
  data-placement={placement}
  {...rest}
>
  {@render children()}
</div>

<style>
  .popover-panel {
    position-area: bottom span-right;
    position-try-fallbacks: flip-block, flip-inline;
    inset: auto;

    margin: 0;
    margin-block-start: var(--space-4);

    padding: var(--space-16);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-base);
    background-color: var(--color-bg-surface-1);
    box-shadow: var(--shadow-2);

    opacity: 0;
  }

  .popover-panel:popover-open {
    opacity: 1;
  }

  .popover-panel[data-placement="bottom-end"] {
    position-area: bottom span-left;
  }

  .popover-panel[data-placement="top-start"] {
    position-area: top span-right;
    margin-block-start: 0;
    margin-block-end: var(--space-8);
  }

  .popover-panel[data-placement="top-end"] {
    position-area: top span-left;
    margin-block-start: 0;
    margin-block-end: var(--space-8);
  }
</style>
