<script>
  let { children } = $props();
</script>

<div class="wrapper">
  {@render children()}
</div>

<style>
  .wrapper {
    width: 100%;
    max-width: var(--app-max-width);
    margin-inline: auto;
  }
</style>
