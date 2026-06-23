<script lang="ts">
  let { labelFor = undefined, id = undefined, children } = $props();
</script>

<label class="text-caption" for={labelFor} {id}>
  {@render children?.()}
</label>

<style>
  label {
    color: var(--color-on-bg-surface);
  }
</style>
