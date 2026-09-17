<script lang="ts">
  let { labelFor = undefined, id = undefined, children, ...rest } = $props();
</script>

<label class="text-caption" for={labelFor} {id} {...rest}>
  {@render children?.()}
</label>

<style>
  label {
    color: var(--color-on-bg-surface);
  }
</style>
