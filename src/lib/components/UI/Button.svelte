<script lang="ts">
  // Can create buttons that are either <a> or <button> elements depending on whether on element prop value

  import type { Snippet } from "svelte";

  interface Props {
    element?: "a" | "button";
    color?: "brand" | "surface" | "app";
    variant?: "raised" | "outline" | "text";
    size?: "small" | "medium" | "large" | "icon";
    class?: string;
    [key: string]: any;
    children?: Snippet;
  }

  let {
    element = "button",
    color = "brand",
    variant = "raised",
    size = "medium",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let classes = $derived(
    ["btn", size, variant, color, className].filter(Boolean).join(" "),
  );
</script>

<svelte:element this={element} class={classes} {...rest}>
  {@render children?.()}
</svelte:element>

<style>
  /* base btn class hoisted to global css file */

  .btn.small {
    padding: var(--space-4);
  }
  .btn.medium {
    padding: var(--space-4) var(--space-8);
  }
  .btn.large {
    padding: var(--space-8) var(--space-12);
  }
  .btn.icon {
    padding: var(--space-4);
  }

  .btn.brand {
    background-color: var(--color-bg-brand);
    border-color: var(--color-border-brand);
    color: var(--color-text-inverse);
  }
  .btn.surface {
    background-color: var(--color-bg-surface);
    border-color: var(--color-border);
  }
  .btn.app {
    background-color: var(--color-bg-app);
    border-color: var(--color-border);
  }

  .btn.brand:hover {
    background-color: var(--color-brand-hover);
  }
  .btn.surface:hover {
    background-color: var(--color-surface-hover);
  }
  .btn.app:hover {
    background-color: var(--color-app-hover);
  }

  .btn.active {
    background-color: var(--color-bg-brand);
    border-color: var(--color-border-brand);
    color: var(--color-text-inverse);
  }

  .btn.raised {
    border: 1px solid transparent;
    box-shadow: var(--shadow-elevation-1);
  }

  .btn.text {
    border: 1px solid transparent;
  }
</style>
