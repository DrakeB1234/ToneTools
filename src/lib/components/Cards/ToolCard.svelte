<script>
  import MaterialIcon from "../Icons/MaterialIcon.svelte";
  import Button from "../UI/Button.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    href = "/",
    color = "",
    icon: Icon,
  } = $props();
</script>

<Button element="a" color="surface" {href}>
  <div class="container">
    <div
      class="icon-container"
      style="background-color: var(--color-deco-{color}-base);"
    >
      <Icon size={"var(--icon-size-med"} />
    </div>
    <div class="text-container">
      <h3>{title}</h3>
      <p class="caption muted line-clamp-3">{description}</p>
    </div>
    <div class="link-action">
      <p class="caption muted">Open</p>
      <MaterialIcon name="arrowRightAlt" color="var(--color-text-muted)" />
    </div>
  </div>
</Button>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h3 {
    margin-top: var(--space-12);
  }

  .text-container {
    margin-bottom: var(--space-16);
  }

  .link-action {
    display: flex;
    align-items: center;
    gap: var(--space-4);

    margin-top: auto;
  }
</style>
