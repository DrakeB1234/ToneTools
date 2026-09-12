<script lang="ts">
  // Meant to act as single source for icons, whether from material library or custom made
  import type { Component } from "svelte";
  import {
    materialIconPaths,
    type MaterialIconPathNames,
  } from "./materialIconPaths";

  export type IconType = Component<any> | MaterialIconPathNames;

  type Props = {
    icon: IconType;
    size?: "base" | "small" | "large";
    color?: string;
  };

  let { icon, size = "base", color = "currentColor" }: Props = $props();

  // svelte-ignore state_referenced_locally
  const parsedSize = () => {
    switch (size) {
      case "small":
        return "18px";
      case "large":
        return "32px";
      default:
        return "24px";
    }
  };

  const finalSize = parsedSize();
</script>

{#if typeof icon === "string"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={finalSize}
    height={finalSize}
    viewBox="0 -960 960 960"
    fill={color}
    class="svg-icon"
  >
    <path d={materialIconPaths[icon]} />
  </svg>
{:else}
  {@const CustomIcon = icon}
  <CustomIcon size={finalSize} {color} />
{/if}
