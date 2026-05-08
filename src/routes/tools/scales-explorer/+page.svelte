<script>
  import Button from "$lib/components/Button.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
</script>

<div class="page">
  <Sidebar />
  <Wrapper>
    <main>
      <div class="header-container">
        <Button element="a" variant="text" size="icon" href="/">
          <MaterialIcon name="arrowLeftAlt" />
        </Button>
        <div class="text-container">
          <p class="caption muted">Tools</p>
          <h1 class="xsmall">Scale Explorer</h1>
        </div>
      </div>

      <section class="card-base input-card">
        <p class="caption muted">Root Note</p>
        <select><option>C</option></select>
      </section>

      <section class="card-base scale-card">
        <p>Scale Notes</p>
      </section>

      <section class="card-base chords-card">
        <p>Diatonic Chords</p>

        <div class="chords-container">
          <div class="card-base inner-card">
            <p>Cmaj</p>
          </div>
          <div class="card-base inner-card">
            <p>Dmin</p>
          </div>
        </div>
      </section>
    </main>
  </Wrapper>
</div>

<style>
  .page {
    display: flex;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);

    width: 100%;
    padding: var(--app-padding);
  }

  .card-base:hover {
    background-color: var(--color-bg-surface);
  }

  .card-base .inner-card {
    box-shadow: none;
    background-color: var(--color-bg-surface-dark);
  }

  .header-container {
    display: flex;
    gap: var(--space-16);
    align-items: center;

    margin-bottom: var(--space-16);
  }

  .text-container {
    display: flex;
    flex-direction: column;
  }

  .chords-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }
</style>
