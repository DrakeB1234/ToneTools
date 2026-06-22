<script>
  import Icon from "../Icons/Icon.svelte";
  import Button from "../UI/Button.svelte";
</script>

<div class="card">
  <h1 class="text-heading-2">Music Training Exercises</h1>
  <p class="text-caption text-max-width-med space-above-small">
    There's a lot to master when it comes to music. Start working on some of the
    many areas of focus today!
  </p>

  <div class="space-above-base">
    <Button element="a" href="/exercises">
      View Exercises
      <Icon icon="arrowRightAlt" />
    </Button>
  </div>
</div>

<style>
  .card {
    padding: var(--space-24) var(--space-24);
    padding-bottom: var(--space-16);

    box-shadow: var(--shadow-elevation-2);
    background-color: var(--color-bg-primary);
  }
  .card * {
    color: var(--color-on-bg-primary);
  }
</style>
