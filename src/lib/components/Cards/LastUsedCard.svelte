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

<InteractiveElement {href}>
  <div class="container">
    <div
      class="icon-container"
      style="background-color: var(--color-deco-{color}-base);"
    >
      <Icon {icon} size={"var(--icon-size-med"} />
    </div>
    <div class="text-container">
      <h3>{title}</h3>
      <p class="text-caption-muted text-max-width-med">{description}</p>
    </div>

    <div class="arrow-container">
      <Icon icon="arrowRightAlt" color="var(--color-text-muted)" />
    </div>
  </div>
</InteractiveElement>

<style>
  .container {
    display: flex;
    gap: var(--space-12);
    width: 100%;
    padding: var(--space-12);
  }

  .icon-container {
    margin-bottom: auto;
  }

  .text-container {
    flex: 1;
  }

  .arrow-container {
    margin-block: auto;
  }
</style>
