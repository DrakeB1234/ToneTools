<script lang="ts">
  // Can create buttons that are either <a> or <button> elements depending on whether on element prop value

  import type { Snippet } from "svelte";

  interface Props {
    variant?: "primary" | "surface" | "surface-dark" | "outline" | "text";
    element?: "a" | "button";
    size?: "small" | "medium" | "large" | "icon";
    class?: string;
    [key: string]: any;
    children?: Snippet;
  }

  let {
    variant = "primary",
    element = "button",
    size = "medium",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  let classes = $derived(
    ["btn", size, variant, className].filter(Boolean).join(" "),
  );
</script>

<svelte:element this={element} class={classes} {...rest}>
  {@render children?.()}
</svelte:element>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);

    padding: var(--space-8) var(--space-12);
    border-radius: var(--radius-8);

    color: var(--color-text);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-sm);
    cursor: pointer;
    text-decoration: none;
    border: none;

    -webkit-tap-highlight-color: transparent;
    transition: var(--transition-color);
  }
  .btn.small {
    padding: var(--space-8);
  }
  .btn.large {
    padding: var(--space-16);
  }
  .btn.icon {
    padding: var(--space-8);
  }

  .primary {
    background-color: var(--color-bg-primary);
    box-shadow: var(--shadow-elevation-1);
    color: var(--color-text-inverse);
  }
  .primary:hover {
    background-color: var(--color-hover-primary);
  }
  .primary:active {
    background-color: var(--color-active-primary);
  }

  .surface {
    background-color: var(--color-bg-surface);
    box-shadow: var(--shadow-elevation-1);
  }

  .surface-dark {
    background-color: var(--color-bg-surface-dark);
  }
  .surface-dark:hover {
    background-color: var(--color-hover-surface);
  }
  .surface-dark:active {
    background-color: var(--color-active-surface);
  }

  .outline {
    border: 1px solid var(--color-border);
    background-color: transparent;
  }

  .text {
    background-color: transparent;
  }

  .active {
    background-color: var(--color-bg-primary);
    color: var(--color-text-inverse);
    border-color: transparent;
  }
  .active :global(.muted) {
    color: var(--color-text-inverse);
  }
  .active:hover {
    background-color: var(--color-bg-primary);
  }

  /* Hover / Active states */
  .surface:hover,
  .outline:hover,
  .text:hover {
    background-color: var(--color-hover-surface);
  }

  .surface:active,
  .outline:active,
  .text:active {
    background-color: var(--color-active-surface);
  }
</style>
