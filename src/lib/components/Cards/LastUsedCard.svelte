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

<a href="/" class="card-base container">
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

  <div class="arrow-container">
    <MaterialIcon name="arrowRightAlt" color="var(--color-text-muted)" />
  </div>
</a>

<style>
  .container {
    display: flex;
    gap: var(--space-12);
    width: 100%;
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
