<script>
  import MaterialIcon from "../Icons/MaterialIcon.svelte";

  let {
    title = "Title",
    description = "Description of the card.",
    color = "",
    icon: Icon,
  } = $props();
</script>

<a href="/" class="card">
  <div
    class="icon-container"
    style="background-color: var(--color-bg-accent-{color});"
  >
    <Icon size={"var(--icon-size-med"} />
  </div>

  <div class="text-container">
    <h3>{title}</h3>
    <p class="caption">{description}</p>
  </div>

  <div class="link-action">
    <p class="caption">Open</p>
    <MaterialIcon name="arrowRightAlt" color="var(--color-text-muted)" />
  </div>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;

    padding: var(--space-16) var(--space-16);

    border-radius: var(--radius-8);
    box-shadow: var(--shadow-elevation-1);
    background-color: var(--color-bg-surface);

    transition: var(--transition-color);
  }
  .card:hover {
    background-color: var(--color-hover-surface);
  }

  h3 {
    margin-top: var(--space-16);
  }

  .text-container p {
    margin-top: var(--space-8);
  }

  .text-container {
    margin-bottom: var(--space-12);
  }

  .link-action {
    display: flex;
    align-items: center;
    gap: var(--space-4);

    margin-top: auto;
  }
</style>
