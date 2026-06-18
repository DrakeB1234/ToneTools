<script lang="ts">
  // Can create buttons that are either <a> or <button> elements depending on whether on element prop value

  import type { Snippet } from "svelte";

  interface Props {
    element?: "a" | "button";
    color?: "primary" | "surface" | "destructive";
    variant?: "filled" | "outline" | "text";
    size?: "base" | "icon-base";
    class?: string;
    [key: string]: any;
    children?: Snippet;
  }

  let {
    element = "button",
    color = "primary",
    variant = "filled",
    size = "base",
    class: className = "",
    active = false,
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={element}
  class="btn"
  class:color={color && `color-${color}`}
  class:variant={variant && `variant-${variant}`}
  class:size={size && `size-${size}`}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style></style>
