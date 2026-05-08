<script>
  import CircleOfFifths from "../Icons/CircleOfFifths.svelte";

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
</a>

<style>
  .card {
    display: flex;
    gap: var(--space-12);

    padding: var(--space-16) var(--space-16);

    border-radius: var(--radius-8);
    box-shadow: var(--shadow-elevation-1);
    background-color: var(--color-bg-surface);

    transition: var(--transition-color);
  }
  .card:hover {
    background-color: var(--color-hover-surface);
  }

  .text-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
</style>
