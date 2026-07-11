<script>
  import Icon from "../Icons/Icon.svelte";
  import Button from "../UI/Button.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    href = "/",
    color = "",
    icon,
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
    <div class="space-above-small">
      <h3>{title}</h3>
      <p class="text-caption-muted text-line-clamp-3 space-above-xsmall">
        {description}
      </p>
    </div>
    <div class="lay-row link-action space-above-base">
      <p class="text-caption-muted">Open</p>
      <Icon icon="arrowRightAlt" color="var(--color-on-bg-surface-subtle)" />
    </div>
  </div>
</Button>

<style>
  :global(.btn.card-button) {
    padding: var(--space-16);
    background-color: var(--color-bg-surface-1);
    border: 1px solid var(--color-border-subtle);
    box-shadow: var(--shadow-1);
  }
  .lay-col {
    height: 100%;
  }
  .link-action {
    gap: var(--space-4);
    margin-top: auto;
    padding-top: var(--space-4);
  }
</style>
