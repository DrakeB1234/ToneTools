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
    width: 100%;

    padding: var(--space-8);

    font-size: var(--font-size-base);
    background-color: var(--color-bg-surface-1);
    color: var(--color-on-bg-surface);
    border-radius: var(--radius-base);
    border: 1px solid var(--color-border);
    cursor: pointer;

    transition: var(--transition-color);
  }
</style>
