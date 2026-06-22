<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    element?: "a" | "button";
    variant?:
      | "primary"
      | "secondary"
      | "outlined"
      | "text"
      | "destructive"
      | "destructive-outlined";
    size?: "small" | "base" | "icon-small" | "icon-base" | "icon-large";
    state?: "on" | "off";
    fullWidth?: boolean;
    circle?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    element = "button",
    variant = "primary",
    size = "base",
    state,
    fullWidth = false,
    circle = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={element}
  data-state={state}
  class="btn variant-{variant} size-{size} {circle && 'circle'} {fullWidth &&
    'full-width'} {className}"
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .btn {
    color: var(--color-on-bg-surface);
  }
  .btn:disabled {
    opacity: 0.7;
  }

  .size-base {
    padding: var(--space-8) var(--space-12);
  }
  .size-small {
    padding: var(--space-4) var(--space-8);
  }
  .size-icon-small {
    padding: var(--space-4);
    aspect-ratio: 1/1;
  }
  .size-icon-base {
    padding: var(--space-8);
    aspect-ratio: 1/1;
  }
  .size-icon-large {
    padding: var(--space-12);
    aspect-ratio: 1/1;
  }

  .full-width {
    width: 100%;
  }

  .circle {
    border-radius: 50%;
  }

  .btn[data-state="on"] {
    --color-on-bg-surface: var(--color-on-bg-primary-subtle);

    background-color: var(--color-bg-primary-subtle);
    border-color: var(--color-on-bg-primary-subtle);
  }

  .variant-primary {
    background-color: var(--color-bg-primary);
    color: var(--color-on-bg-primary);
  }

  .variant-secondary {
    background-color: var(--color-bg-secondary);
    color: var(--color-on-bg-secondary);
  }

  .variant-destructive {
    background-color: var(--color-bg-danger);
    color: var(--color-on-bg-primary);
  }

  .variant-outlined {
    background-color: transparent;
    border-color: var(--color-border);
    color: var(--color-on-bg-surface);
  }

  .variant-text {
    background-color: transparent;
    color: var(--color-on-bg-surface);
  }

  .variant-destructive-outlined {
    background-color: transparent;
    border-color: var(--color-bg-danger);
    color: var(--color-bg-danger);
  }

  @media (hover: hover) {
    .variant-primary:hover:not(:disabled) {
      background-color: var(--color-bg-primary-active);
    }
    .variant-secondary:hover:not(:disabled) {
      background-color: var(--color-bg-secondary-active);
    }
    .variant-destructive:hover:not(:disabled) {
      background-color: var(--color-bg-danger-active);
    }

    .variant-outlined:hover:not(:disabled),
    .variant-text:hover:not(:disabled) {
      background-color: var(--color-bg-surface-1-active);
    }
    .variant-destructive-outlined:hover:not(:disabled) {
      background-color: var(--color-bg-tint-danger);
    }
    .btn[data-state="on"]:hover {
      background-color: var(--color-bg-primary-subtle);
    }
  }

  @media (hover: none) {
    .variant-primary:active:not(:disabled) {
      background-color: var(--color-bg-primary-active);
    }
    .variant-secondary:active:not(:disabled) {
      background-color: var(--color-bg-secondary-active);
    }
    .variant-destructive:active:not(:disabled) {
      background-color: var(--color-bg-danger-active);
    }

    .variant-outlined:active:not(:disabled),
    .variant-text:active:not(:disabled) {
      background-color: var(--color-bg-surface-2);
    }
    .variant-destructive-outlined:active:not(:disabled) {
      background-color: var(--color-bg-tint-danger);
    }
    .btn[data-state="on"]:active {
      background-color: var(--color-bg-primary-subtle);
    }
  }
</style>
