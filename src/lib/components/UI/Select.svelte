<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";

  export type Option = { value: string | number; label: string } | string;

  interface Props extends Omit<HTMLSelectAttributes, "value"> {
    value?: string | number;
    options: Option[];
    ref?: HTMLSelectElement | null;
  }

  let {
    value = $bindable(""),
    options = [],
    ref = $bindable(null),
    class: className = "",
    ...restProps
  }: Props = $props();
</script>

<select bind:this={ref} bind:value class={className} {...restProps}>
  {#each options as option}
    {#if typeof option === "string"}
      <option value={option}>{option}</option>
    {:else}
      <option value={option.value}>{option.label}</option>
    {/if}
  {/each}
</select>

<style>
  select {
    padding: var(--space-8);

    font-size: var(--font-size-base);
    color: var(--color-text);
    background-color: transparent;
    border-radius: var(--radius-8);
    border: 1px solid var(--color-border);

    transition: var(--transition-color);
  }
  select:hover {
    background-color: var(--color-hover-surface);
  }
</style>
