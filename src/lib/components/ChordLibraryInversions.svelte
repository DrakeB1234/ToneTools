<script>
  import Button from "./UI/Button.svelte";
</script>

<div class="button-container">
  <Button color="surface" variant="outline" class="active">Inversions</Button>
  <Button color="surface" variant="outline">Voicings</Button>
</div>

<div class="inversions-container"></div>
<div class=""></div>

<style>
  .button-container :global(.btn.active) {
    background-color: var(--color-surface-active);
    border-color: var(--color-border);
  }
</style>
