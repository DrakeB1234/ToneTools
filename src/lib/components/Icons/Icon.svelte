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
    size?: string;
    color?: string;
  };

  let {
    icon,
    size = "var(--icon-size-base)",
    color = "currentColor",
  }: Props = $props();
</script>

{#if typeof icon === "string"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 -960 960 960"
    fill={color}
  >
    <path d={materialIconPaths[icon]} />
  </svg>
{:else}
  {@const CustomIcon = icon}
  <CustomIcon {size} {color} />
{/if}
