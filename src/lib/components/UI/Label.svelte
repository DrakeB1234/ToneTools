<script lang="ts">
  let { labelFor = "", children } = $props();
</script>

<label class="input-label" for={labelFor}>
  {@render children?.()}
</label>

<style>
  label {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>
