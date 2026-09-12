<script>
  import DAW from "../Icons/DAW.svelte";
  import Icon from "../Icons/Icon.svelte";
  import Button from "../UI/Button.svelte";
</script>

<div class="card">
  <div class="card__header flex-row">
    <Icon icon={DAW} color="var(--color-on-bg-primary)" size="large" />
    <div>
      <h1 class="text-heading-2">Chord Progression Creator</h1>
      <p class="text-caption text-max-width-base space-above-sm">
        Experiment with chords and choose between various styles to hear your
        progression in!
      </p>
      <Button
        element="a"
        size="small"
        class="space-above-base"
        href="/tools/chord-progression"
      >
        Open Tool
        <Icon icon="arrowRightAlt" />
      </Button>
    </div>
  </div>
</div>

<style>
  .card {
    position: relative;
    padding: var(--space-24) var(--space-24);

    border-radius: var(--radius-lg);
    border: none;
    background: linear-gradient(
      90deg,
      rgba(38, 115, 238, 1) 47%,
      rgb(82, 171, 222) 100%
    );
  }

  .card__header {
    align-items: start;
    gap: var(--space-12);
  }

  .card h1,
  .card p {
    color: var(--color-on-bg-primary);
  }
</style>
