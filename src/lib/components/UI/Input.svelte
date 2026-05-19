<script lang="ts">
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements";

  type InputType = Exclude<HTMLInputTypeAttribute, "file">;

  type Props = Omit<HTMLInputAttributes, "type" | "class"> & {
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
    padding: var(--space-8);

    font-size: var(--font-size-sm);
    color: var(--color-text);
    background-color: transparent;
    border-radius: var(--radius-8);
    border: 1px solid var(--color-border);
  }
  input::placeholder {
    color: var(--color-text-muted);
  }
</style>
