<script lang="ts">
  let { text = "d", labelFor = "d" } = $props();
</script>

<label class="input-label" for={labelFor}>{text}</label>

<style>
  label {
    font-size: var(--font-size-14);
    color: var(--color-text-muted);
  }
</style>
