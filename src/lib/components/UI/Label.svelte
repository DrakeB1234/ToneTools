<script lang="ts">
  let { labelFor = "", children } = $props();
</script>

<label class="text-caption" for={labelFor}>
  {@render children?.()}
</label>

<style>
  label {
    color: var(--color-on-bg-surface);
  }
</style>
