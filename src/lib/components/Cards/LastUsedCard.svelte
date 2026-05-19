<script>
  import MaterialIcon from "../Icons/MaterialIcon.svelte";
  import Button from "../UI/Button.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    color = "",
    icon: Icon,
  } = $props();
</script>

<Button element="a" color="surface" size="large" href="/">
  <div class="container">
    <div
      class="icon-container"
      style="background-color: var(--color-deco-{color}-base);"
    >
      <Icon size={"var(--icon-size-med"} />
    </div>
    <div class="text-container">
      <h3>{title}</h3>
      <p class="caption muted">{description}</p>
    </div>

    <MaterialIcon name="arrowRightAlt" color="var(--color-text-muted)" />
  </div>
</Button>

<style>
  .container {
    display: flex;
    align-items: center;
    gap: var(--space-12);
    width: 100%;
  }

  .icon-container {
    margin-bottom: auto;
  }

  .text-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
</style>
