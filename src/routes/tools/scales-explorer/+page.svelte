<script lang="ts">
  import Button from "$lib/components/UI/Button.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import type { Option } from "$lib/components/UI/Select.svelte";
  import PianoRoll from "$lib/components/PianoRoll.svelte";
  import {
    getAllModes,
    getEnharmonicNotesFromArray,
    getNoteNamesCircleOfFifths,
    getModeDiatonicTriads,
    getScaleNotes,
    type getModeDiatonicTriadsReturn,
  } from "$lib/helpers/musicTheory";

  const _getScaleNotes = (root: string, scaleType: string): string[] | null => {
    const notes = getScaleNotes(root, scaleType);

    if (!notes) {
      console.error(`Invalid scale provided: ${root}, ${scaleType}`);
      return null;
    }
    return notes;
  };

  const _getScaleTriads = (
    root: string,
    scaleType: string,
  ): getModeDiatonicTriadsReturn[] | null => {
    const chords = getModeDiatonicTriads(root, scaleType);

    if (!chords) {
      console.error(`Invalid scale provided: ${root}, ${scaleType}`);
      return null;
    }

    return chords;
  };

  const getPianoRollNotes = (
    root: string,
    scaleType: string,
  ): string[] | null => {
    const initialNotes = getScaleNotes(root, scaleType, 1);

    if (!initialNotes) {
      console.error(`Invalid scale provided: ${root}, ${scaleType}, ${1}`);
      return null;
    }

    const enharmnoicNotes = getEnharmonicNotesFromArray(initialNotes, false);
    return enharmnoicNotes;
  };

  const selectNoteOptions: Option[] = getNoteNamesCircleOfFifths(true);
  const selectScaleOptions: Option[] = getAllModes();

  let initialSelectNoteValue = selectNoteOptions[0] as string;
  let initialSelectScaleValue = selectScaleOptions[0] as string;
  let initialScaleNotes: string[] =
    _getScaleNotes(initialSelectNoteValue, initialSelectScaleValue) ?? [];
  let initialScaleTriads: getModeDiatonicTriadsReturn[] =
    _getScaleTriads(initialSelectNoteValue, initialSelectScaleValue) ?? [];
  let initialPianoRollNotes: string[] =
    getPianoRollNotes(initialSelectNoteValue, initialSelectScaleValue) ?? [];

  let selectNoteValue = $state(initialSelectNoteValue);
  let selectScaleValue = $state(initialSelectScaleValue);

  let currentScaleNotes: string[] = $state(initialScaleNotes);
  let currentScaleTriads: getModeDiatonicTriadsReturn[] =
    $state(initialScaleTriads);
  let currentPianoRollNotes: string[] = $state(initialPianoRollNotes);

  const pianoClickCallBack = (note: string) => {
    console.log(note);
  };

  const handleInputChange = () => {
    const notes = _getScaleNotes(selectNoteValue, selectScaleValue);
    const pianoRollNotes = getPianoRollNotes(selectNoteValue, selectScaleValue);
    const triads = _getScaleTriads(selectNoteValue, selectScaleValue);

    if (notes === null || pianoRollNotes === null || triads === null) {
      // Handle Error UI State

      selectNoteValue = initialSelectNoteValue;
      selectScaleValue = initialSelectScaleValue;
      return;
    }

    currentScaleNotes = notes;
    currentScaleTriads = triads;
    currentPianoRollNotes = pianoRollNotes;
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
          <h1 class="header-base">Scale Explorer</h1>
        </div>
      </div>

      <section class="card-base input-card">
        <div class="input-group">
          <Label text="Root" labelFor="root" />
          <Select
            id="root"
            options={selectNoteOptions}
            bind:value={selectNoteValue}
            onchange={handleInputChange}
          />
        </div>
        <div class="input-group">
          <Label text="Scale" labelFor="scale" />
          <Select
            id="scale"
            options={selectScaleOptions}
            bind:value={selectScaleValue}
            onchange={handleInputChange}
          />
        </div>
      </section>

      <section class="card-base scale-card">
        <h3>Scale Notes</h3>
        <div class="scale-notes-container">
          {#each currentScaleNotes as note (note)}
            <Button variant="outline">{note}</Button>
          {/each}
        </div>

        <hr class="divider" />

        <h3>Piano Roll</h3>

        <div class="piano-roll-container">
          <PianoRoll
            octaves={2}
            activeNotes={currentPianoRollNotes}
            {pianoClickCallBack}
          />
        </div>
      </section>

      <section class="card-base chords-card">
        <h3>Diatonic Chords</h3>

        <div class="chords-container">
          {#each currentScaleTriads as triadObj (triadObj.chordName)}
            <div class="inner-card-base clickable">
              <p>{triadObj.chordName}</p>
              <p>{triadObj.notes}</p>
            </div>
          {/each}
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
