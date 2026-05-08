<script>
  import Button from "../UI/Button.svelte";
  import MaterialIcon from "../Icons/MaterialIcon.svelte";
</script>

<div class="card-base">
  <h1 class="small">Music Training Exercises</h1>
  <p class="caption">
    There's a lot to master when it comes to music. Start working on some of the
    many areas of focus today!
  </p>

  <Button element="a" variant="surface" href="/exercises">
    View Exercises
    <MaterialIcon name="arrowRightAlt" color="var(--color-text-primary)" />
  </Button>
</div>

<style>
  .card-base {
    padding: var(--space-24) var(--space-24);

    box-shadow: var(--shadow-elevation-2);
    background-color: var(--color-bg-primary-dark);
  }

  h1 {
    color: var(--color-text-inverse);
  }

  p.caption {
    color: var(--color-text-inverse-muted);
    margin-top: var(--space-12);
    margin-bottom: var(--space-24);

    max-width: var(--text-box-width-small);
  }
</style>
