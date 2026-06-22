<script>
  import Icon from "../Icons/Icon.svelte";
  import InteractiveElement from "../UI/InteractiveElement.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    color = "",
    icon,
    href = "/",
  } = $props();
</script>

<InteractiveElement variant="card" {href}>
  <div class="lay-row">
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
</InteractiveElement>

<style>
  .lay-row {
    gap: var(--space-16);
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
