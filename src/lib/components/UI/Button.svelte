<script lang="ts">
  // Can create buttons that are either <a> or <button> elements depending on whether on element prop value

  import type { Snippet } from "svelte";

  interface Props {
    element?: "a" | "button";
    color?: "brand" | "app" | "surface" | "surface-dark";
    variant?: "raised" | "outline" | "text";
    shape?: "small" | "medium" | "large" | "circle";
    active?: boolean;
    class?: string;
    [key: string]: any;
    children?: Snippet;
  }

  let {
    element = "button",
    color = "brand",
    variant = "raised",
    shape = "medium",
    class: className = "",
    active = false,
    children,
    ...rest
  }: Props = $props();

  let classes = $derived(
    ["btn", `color-${color}`, `variant-${variant}`, `shape-${shape}`, className]
      .filter(Boolean)
      .join(" "),
  );
</script>

<svelte:element this={element} class={classes} class:active {...rest}>
  {@render children?.()}
</svelte:element>

<style>
  /* base btn class hoisted to global css file */

  .shape-small {
    padding: var(--space-4);
  }
  .shape-medium {
    padding: var(--space-4) var(--space-8);
  }
  .shape-large {
    padding: var(--space-8) var(--space-12);
  }
  .shape-icon {
    padding: var(--space-4);
  }
  .shape-circle {
    display: grid;
    place-items: center;

    width: 48px;
    height: 48px;

    border-radius: var(--radius-full);
  }

  .variant-raised {
    border-color: transparent !important;
    box-shadow: var(--shadow-elevation-1);
  }

  .variant-text {
    border-color: transparent !important;
  }

  .color-brand {
    background-color: var(--color-bg-brand);
    color: var(--color-text-inverse);
  }
  .color-app {
    background-color: var(--color-bg-app);
    border-color: var(--color-border);
  }
  .color-surface {
    background-color: var(--color-bg-surface);
    border-color: var(--color-border);
  }
  .color-surface-dark {
    background-color: var(--color-bg-surface-dark);
    border-color: var(--color-border);
  }

  a.btn:focus {
    outline: 2px solid var(--palette-brand-400);
  }

  /* hover state */

  .color-brand:hover:not(:disabled) {
    background-color: var(--color-brand-hover);
  }
  .color-app:hover {
    background-color: var(--color-app-hover);
  }
  .color-surface:hover {
    background-color: var(--color-surface-hover);
  }
  .color-surface-dark:hover {
    background-color: var(--color-surface-dark-hover);
  }

  /* active state */

  .btn.active {
    background-color: var(--color-bg-brand);
    border-color: transparent;
    color: var(--color-text-inverse);
  }
  .btn.active:hover {
    background-color: var(--color-bg-brand);
  }

  /* disabled state */
  .btn:disabled {
    cursor: default;
  }
  .color-brand:disabled {
    background-color: var(--color-brand-disabled);
  }
</style>
