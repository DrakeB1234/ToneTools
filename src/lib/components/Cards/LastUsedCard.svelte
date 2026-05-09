<script>
  import MaterialIcon from "../Icons/MaterialIcon.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    color = "",
    icon: Icon,
  } = $props();
</script>

<a href="/" class="card-base clickable">
  <div
    class="icon-container"
    style="background-color: var(--color-bg-accent-{color});"
  >
    <Icon size={"var(--icon-size-med"} />
  </div>
  <div class="text-container">
    <h3>{title}</h3>
    <p class="caption muted">{description}</p>
  </div>

  <MaterialIcon name="arrowRightAlt" />
</a>

<style>
  .card-base {
    display: flex;
    align-items: center;
    gap: var(--space-12);
  }

  .text-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
</style>
