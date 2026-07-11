<script>
  import Icon from "../Icons/Icon.svelte";
  import Button from "../UI/Button.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    color = "",
    icon,
    href = "/",
  } = $props();
</script>

<Button element="a" variant="text" class="card-button" {href}>
  <div class="lay-col">
    <div
      class="icon-container"
      style="background-color: var(--color-bg-addon-{color});"
    >
      <Icon {icon} />
    </div>
    <div class="text-container">
      <h3>{title}</h3>
      <p class="text-caption-muted text-max-width-med">{description}</p>
    </div>

    <div class="arrow-container">
      <Icon icon="arrowRightAlt" color="var(--color-on-bg-surface-subtle)" />
    </div>
  </div>
</Button>

<style>
  .lay-col {
    min-width: 200px;
  }
  .text-container {
    flex: 1;
  }
  .icon-container {
    margin-bottom: auto;
  }
  .arrow-container {
    margin-left: auto;
  }
</style>
