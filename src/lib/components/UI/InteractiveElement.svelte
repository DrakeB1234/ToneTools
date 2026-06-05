<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    element?: "a" | "button";
    color?: "brand" | "surface" | "surface-dark" | "app";
    variant?: "raised" | "outline" | "text";
    activeStyle?: "active-style-1" | "active-style-2";
    active?: boolean;
    [key: string]: any;
    children?: Snippet;
  }

  let {
    element = "a",
    color = "surface",
    variant = "raised",
    activeStyle = "active-style-1",
    active = false,
    children,
    ...rest
  }: Props = $props();

  let classes = $derived(
    ["btn", variant, color, activeStyle].filter(Boolean).join(" "),
  );
</script>

<svelte:element this={element} class={classes} class:active {...rest}>
  {@render children?.()}
</svelte:element>

<style>
  /* base btn class hoisted to global css file */

  .btn {
    padding: 0;
  }

  a.btn:focus {
    outline: 2px solid var(--palette-brand-400);
  }

  .btn.brand {
    background-color: var(--color-bg-brand);
    color: var(--color-text-inverse);
  }
  .btn.surface {
    background-color: var(--color-bg-surface);
    border-color: var(--color-border);
  }
  .btn.surface-dark {
    background-color: var(--color-bg-surface-dark);
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
  .btn.surface-dark:hover {
    background-color: var(--color-surface-dark-hover);
  }
  .btn.app:hover {
    background-color: var(--color-app-hover);
  }

  .btn.active {
    background-color: var(--color-bg-brand);
    color: var(--color-text-inverse);
  }
  .btn.active:hover {
    background-color: var(--color-bg-brand);
  }
  .active.active-style-2 {
    background-color: var(--color-bg-brand-light);
    border: 1px solid var(--color-border-brand);
    color: var(--color-text);
  }
  .active.active-style-2:hover {
    background-color: var(--color-brand-light-hover);
  }

  .btn.raised {
    border: 1px solid transparent;
    box-shadow: var(--shadow-elevation-1);
  }

  .btn.text {
    border: 1px solid transparent;
  }
</style>
