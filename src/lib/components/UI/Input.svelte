<script lang="ts">
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements";

  type InputType = Exclude<HTMLInputTypeAttribute, "file">;

  type Props = Omit<HTMLInputAttributes, "type"> & {
    ref?: HTMLInputElement | null;
  } & (
      | { type: "file"; files?: FileList }
      | { type?: InputType; files?: undefined }
    );

  let {
    ref = $bindable(null),
    value = $bindable(),
    type = "text",
    files = $bindable(),
    "data-slot": dataSlot = "input",
    ...restProps
  }: Props = $props();
</script>

<input bind:this={ref} data-slot={dataSlot} {type} bind:value {...restProps} />

<style>
  input {
    width: 100%;
    padding: var(--space-8);

    font-size: var(--font-size-base);
    color: var(--color-on-bg-surface);
    background-color: var(--color-bg-surface-1);
    border-radius: var(--radius-base);
    border: 1px solid var(--color-border);
  }
  input::placeholder {
    color: var(--color-on-bg-surface-subtle);
  }
</style>
