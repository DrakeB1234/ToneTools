<script lang="ts">
  import Button from "$lib/components/UI/Button.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import type { Option } from "$lib/components/UI/Select.svelte";
  import PianoRoll from "$lib/components/PianoRoll.svelte";

  const noteNames = ["C", "D", "E", "F", "G", "A", "B"];

  const selectOptionsNote: Option[] = noteNames.map((e) => {
    return { label: e, value: e };
  });
  const selectOptionsScales: Option[] = [
    { label: "Major", value: "Major" },
    { label: "Minor", value: "Minor" },
    { label: "Dorian", value: "Dorian" },
  ];

  const pianoRollActiveNotes = ["C#1", "F1", "G#1"];

  const pianoClickCallBack = (note: string) => {
    console.log(note);
  };
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
          <h1 class="text-base">Scale Explorer</h1>
        </div>
      </div>

      <section class="card-base input-card">
        <div class="input-group">
          <Label text="Root" labelFor="root" />
          <Select id="root" options={selectOptionsNote} value={"C"} />
        </div>
        <div class="input-group">
          <Label text="Scale" labelFor="scale" />
          <Select id="scale" options={selectOptionsScales} value={"Major"} />
        </div>
      </section>

      <section class="card-base scale-card">
        <h3>Scale Notes</h3>
        <div class="scale-notes-container">
          {#each noteNames as note (note)}
            <Button variant="outline">{note}</Button>
          {/each}
        </div>

        <hr class="divider" />

        <h3>Piano Roll</h3>

        <div class="piano-roll-container">
          <PianoRoll
            octaves={2}
            activeNotes={pianoRollActiveNotes}
            {pianoClickCallBack}
          />
        </div>
      </section>

      <section class="card-base chords-card">
        <h3>Diatonic Chords</h3>

        <div class="chords-container">
          <div class="inner-card-base clickable">
            <p>Cmaj</p>
          </div>
          <div class="inner-card-base clickable">
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

  /* Fixes wierd overflow with flexbox with PianoRoll Component. WTH? */
  .page :global(> .wrapper) {
    min-width: 0;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);

    width: 100%;
    padding: var(--app-padding);
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

  .input-card {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
    gap: var(--space-12);
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  h3 {
    margin-bottom: var(--space-16);
  }

  .scale-notes-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-8);
  }

  .piano-roll-container {
    overflow: hidden;
  }

  .divider {
    margin-block: var(--space-16);
  }

  .chords-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }
</style>
