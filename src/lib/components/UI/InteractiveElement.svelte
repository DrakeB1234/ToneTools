<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "card" | "secondary" | "outlined" | "text";
    fullWidth?: boolean;
    fullHeight?: boolean;
    state?: "on" | "off";
    href?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    variant = "secondary",
    fullWidth = false,
    fullHeight = false,
    state,
    href,
    children,
    ...rest
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let element: "a" | "button" = href ? "a" : "button";
  // svelte-ignore state_referenced_locally
  let buttonClass = [
    "interactive-element",
    `variant-${variant}`,
    fullWidth && "full-width",
    fullHeight && "full-height",
  ]
    .filter(Boolean)
    .join(" ");
</script>

<svelte:element
  this={element}
  {href}
  data-state={state}
  class={buttonClass}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .interactive-element {
    display: block;

    padding: var(--space-16);
    margin: 0;

    border: 1px solid transparent;
    border-radius: var(--radius-base);
    background-color: transparent;
    cursor: pointer;
    transition: var(--transition-color);

    -webkit-tap-highlight-color: transparent;
  }

  .full-width {
    width: 100%;
  }
  .full-height {
    height: 100%;
  }

  .interactive-element[data-state="on"] {
    --color-on-bg-surface: var(--color-on-bg-primary-subtle);

    background-color: var(--color-bg-primary-subtle);
    border-color: var(--color-on-bg-primary-subtle);
  }

  .variant-card {
    border-radius: var(--radius-large);
    border-color: var(--color-border-subtle);
    background-color: var(--color-bg-surface-1);
    box-shadow: var(--shadow-card);
  }
  .variant-secondary {
    background-color: var(--color-bg-secondary);
  }
  .variant-outlined {
    border-color: var(--color-border);
  }

  @media (hover: hover) {
    .variant-card:hover {
      background-color: var(--color-bg-surface-1-active);
    }
    .variant-secondary:hover {
      background-color: var(--color-bg-secondary-active);
    }
    .variant-outlined:hover {
      background-color: var(--color-bg-surface-1-active);
    }
    .variant-text:hover {
      background-color: var(--color-bg-surface-1-active);
    }
    .interactive-element[data-state="on"]:hover {
      background-color: var(--color-bg-primary-subtle);
    }
  }

  @media (hover: none) {
    .variant-card:active {
      background-color: var(--color-bg-surface-1-active);
    }
    .variant-secondary:active {
      background-color: var(--color-bg-secondary-active);
    }
    .variant-outlined:active {
      background-color: var(--color-bg-surface-1-active);
    }
    .variant-text:active {
      background-color: var(--color-bg-surface-1-active);
    }
    .interactive-element[data-state="on"]:active {
      background-color: var(--color-bg-primary-subtle);
    }
  }

  .action-card:active {
    background-color: var(--color-bg-surface-2);
  }
</style>
