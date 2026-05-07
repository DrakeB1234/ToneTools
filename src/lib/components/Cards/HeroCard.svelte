<script>
  import Button from "../Button.svelte";
</script>

<div class="card">
  <h1 class="small">Music Training Exercises</h1>
  <p class="caption">
    There's a lot to master when it comes to music. Start working on some of the
    many areas of focus today!
  </p>

  <Button element="button" variant="surface" href="/exercises"
    >Get Started</Button
  >
</div>

<style>
  .card {
    padding: var(--space-16) var(--space-24);
    border-radius: var(--radius-16);
    background-color: var(--color-bg-primary-dark);

    p,
    h1 {
      color: var(--color-text-inverse);
    }

    p.caption {
      color: var(--color-text-inverse-muted);
    }
  }

  p.caption {
    margin-top: var(--space-8);
    margin-bottom: var(--space-24);
  }
</style>
