<script lang="ts">
  // Can create buttons that are either <a> or <button> elements depending on whether on element prop value

  import type { Snippet } from "svelte";

  interface Props {
    element?: "a" | "button";
    color?: "brand" | "surface" | "app" | "transparent";
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
  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-4);

    padding: var(--space-8) var(--space-12);
    border-radius: var(--radius-8);

    color: var(--color-text);
    border-color: var(--color-border);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-sm);
    cursor: pointer;
    text-decoration: none;
    border: 1px solid transparent;

    -webkit-tap-highlight-color: transparent;
    transition: var(--transition-color);
  }
  .btn.small {
    padding: var(--space-8);
  }
  .btn.icon {
    padding: var(--space-8);
  }

  .btn.brand {
    background-color: var(--color-bg-brand);
    border-color: var(--color-border-brand);
    color: var(--color-text-inverse);
  }
  .btn.surface {
    background-color: var(--color-bg-surface);
  }
  .btn.app {
    background-color: var(--color-bg-app);
  }
  .btn.transparent {
    background-color: transparent;
  }

  .btn.brand:hover {
    background-color: var(--color-brand-hover);
  }
  .btn.surface:hover,
  .btn.transparent:hover {
    background-color: var(--color-surface-hover);
  }
  .btn.app:hover {
    background-color: var(--color-app-hover);
  }

  .btn.text {
    border: 1px solid transparent;
  }

  .btn.raised {
    border: 1px solid transparent;
    box-shadow: var(--shadow-elevation-1);
  }
</style>
