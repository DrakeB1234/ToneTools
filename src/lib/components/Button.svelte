<script lang="ts">
  // Can create buttons that are either <a> or <button> elements depending on whether on element prop value

  import type { Snippet } from "svelte";

  interface Props {
    variant?: "primary" | "surface" | "text";
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

{#if element === "a"}
  <a class={classes} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <button class={classes} {...rest}>
    {@render children?.()}
  </button>
{/if}

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
    cursor: pointer;
    text-decoration: none;
    border: none;

    transition: var(--transition-color);
  }
  .btn.small {
    padding: var(--space-12);
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
  .surface:hover {
    background-color: var(--color-hover-surface);
  }
  .surface:active {
    background-color: var(--color-active-surface);
  }

  .text:hover {
    background-color: var(--color-hover-surface);
  }
  .text:active {
    background-color: var(--color-active-surface);
  }
  .text.active {
    background-color: var(--color-bg-primary);
    color: var(--color-text-inverse);
  }
  .text.active :global(.muted) {
    color: var(--color-text-inverse);
  }
  .text.active:hover {
    background-color: var(--color-hover-primary);
  }
  .text.active:active {
    background-color: var(--color-active-primary);
  }
</style>
