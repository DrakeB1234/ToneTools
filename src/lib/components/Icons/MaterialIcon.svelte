<script lang="ts">
  import {
    materialIconPaths,
    type MaterialIconPathNames,
  } from "./materialIconPaths";

  interface IconProps {
    name: MaterialIconPathNames;
    size?: string;
    color?: string;
  }

  let {
    name,
    size = "var(--icon-size-base)",
    color = "currentColor",
  }: IconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 -960 960 960"
  fill={color}
>
  {@html materialIconPaths[name]}
</svg>
