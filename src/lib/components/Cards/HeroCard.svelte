<script>
  import Icon from "../Icons/Icon.svelte";
  import Button from "../UI/Button.svelte";
</script>

<div class="card-base">
  <h1 class="text-heading-2">Music Training Exercises</h1>
  <p class="text-caption text-max-width-med">
    There's a lot to master when it comes to music. Start working on some of the
    many areas of focus today!
  </p>

  <Button
    element="a"
    color="brand"
    variant="outline"
    shape="large"
    href="/exercises"
  >
    View Exercises
    <Icon icon="arrowRightAlt" />
  </Button>
</div>

<style>
  .card-base {
    padding: var(--space-24) var(--space-24);
    padding-bottom: var(--space-16);

    box-shadow: var(--shadow-elevation-2);
    background-color: var(--color-bg-brand);
    color: var(--color-text-primary);
  }

  h1 {
    color: var(--color-text-inverse);
  }

  p:nth-child(2n) {
    color: var(--color-text-primary);
  }

  p.text-caption {
    color: var(--color-text-inverse-muted);
    margin-top: var(--space-12);
    margin-bottom: var(--space-16);
  }
</style>
