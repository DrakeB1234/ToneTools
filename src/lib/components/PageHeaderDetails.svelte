<script>
  import MaterialIcon from "./Icons/MaterialIcon.svelte";
  import Button from "./UI/Button.svelte";

  let { subText, headerText, href } = $props();
</script>

<div class="header-container">
  <Button element="a" color="app" variant="text" size="icon" {href}>
    <MaterialIcon name="arrowLeftAlt" />
  </Button>
  <div class="text-container">
    <p class="caption muted">{subText}</p>
    <h1 class="header-base">{headerText}</h1>
  </div>
</div>

<style>
  .header-container {
    display: flex;
    gap: var(--space-16);
    align-items: center;
  }
</style>
