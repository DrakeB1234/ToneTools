<script lang="ts">
  import Button from "$lib/components/UI/Button.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
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
    getNumeralsFromMode,
    getFormulaFromMode,
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

  interface uiState {
    selectNoteValue: string;
    selectScaleValue: string;

    scaleNotes: string[];
    scaleTriads: getModeDiatonicTriadsReturn[];
    scaleNumerals: string[];
    scaleFormula: string[];
    pianoRollNotes: string[];
  }

  const selectNoteOptions: Option[] = getNoteNamesCircleOfFifths(true);
  const selectScaleOptions: Option[] = getAllModes();

  let initialSelectNoteValue = selectNoteOptions[0] as string;
  let initialSelectScaleValue = selectScaleOptions[0] as string;

  let uiState: uiState = $state({
    selectNoteValue: initialSelectNoteValue,
    selectScaleValue: initialSelectScaleValue,

    scaleNotes:
      _getScaleNotes(initialSelectNoteValue, initialSelectScaleValue) ?? [],
    scaleTriads:
      _getScaleTriads(initialSelectNoteValue, initialSelectScaleValue) ?? [],
    scaleNumerals: getNumeralsFromMode(initialSelectScaleValue) ?? [],
    scaleFormula: getFormulaFromMode(initialSelectScaleValue) ?? [],
    pianoRollNotes:
      getPianoRollNotes(initialSelectNoteValue, initialSelectScaleValue) ?? [],
  });

  const handleInputChange = () => {
    const notes = _getScaleNotes(
      uiState.selectNoteValue,
      uiState.selectScaleValue,
    );
    const pianoRollNotes = getPianoRollNotes(
      uiState.selectNoteValue,
      uiState.selectScaleValue,
    );
    const triads = _getScaleTriads(
      uiState.selectNoteValue,
      uiState.selectScaleValue,
    );
    const numerals = getNumeralsFromMode(uiState.selectScaleValue);
    const formula = getFormulaFromMode(uiState.selectScaleValue);

    if (!notes || !pianoRollNotes || !triads || !numerals || !formula) {
      // Handle Error UI State

      uiState.selectNoteValue = initialSelectNoteValue;
      uiState.selectScaleValue = initialSelectScaleValue;
      return;
    }

    uiState = {
      ...uiState,
      scaleNotes: notes,
      pianoRollNotes: pianoRollNotes,
      scaleTriads: triads,
      scaleNumerals: numerals,
      scaleFormula: formula,
    };
  };
</script>

<Wrapper>
  <main>
    <div class="header-container">
      <Button element="a" variant="text" size="icon" href="/">
        <MaterialIcon name="arrowLeftAlt" />
      </Button>
      <div class="text-container">
        <p class="caption muted">Tools</p>
        <h1 class="header-base">Scale Library</h1>
      </div>
    </div>

    <section class="card-base input-card">
      <div class="input-group">
        <Label text="Root" labelFor="root" />
        <Select
          id="root"
          options={selectNoteOptions}
          bind:value={uiState.selectNoteValue}
          onchange={handleInputChange}
        />
      </div>
      <div class="input-group">
        <Label text="Scale" labelFor="scale" />
        <Select
          id="scale"
          options={selectScaleOptions}
          bind:value={uiState.selectScaleValue}
          onchange={handleInputChange}
        />
      </div>
    </section>

    <section class="card-base scale-card">
      <h2 class="header-base">Scale Notes</h2>
      <div class="scale-notes-container">
        {#each uiState.scaleNotes as note (note)}
          <Button variant="text">{note}</Button>
        {/each}
      </div>

      <div class="inner-card-base piano-roll-container">
        <PianoRoll octaves={2} activeNotes={uiState.pianoRollNotes} />
      </div>

      <hr class="divider" />

      <div class="inner-card-base">
        <h2 class="header-base">Numerals</h2>
        <p>
          {#each uiState.scaleNumerals as note, i (note)}
            {note}
            {#if i < uiState.scaleNumerals.length - 1}
              {" - "}
            {/if}
          {/each}
        </p>

        <hr class="divider" />

        <h2 class="header-base">
          Formula <span class="caption">(relative to major)</span>
        </h2>
        <p>
          {#each uiState.scaleFormula as note, i (note)}
            {note}
            {#if i < uiState.scaleFormula.length - 1}
              {" - "}
            {/if}
          {/each}
        </p>
      </div>
    </section>

    <section class="card-base chords-card">
      <h2 class="header-base">Diatonic Chords</h2>

      <div class="chords-container">
        {#each uiState.scaleTriads as triadObj (triadObj.chordName)}
          <div class="inner-card-base clickable chord-card">
            <div class="pill" data-quality={triadObj.quality}>
              <h3>{triadObj.numeral}</h3>
            </div>
            <div class="text-container">
              <h3>{triadObj.chordName}</h3>
              <p class="caption muted">
                {#each triadObj.notes as note, i (note)}
                  {note}
                  {#if i < triadObj.notes.length - 1}
                    {" - "}
                  {/if}
                {/each}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </main>
</Wrapper>

<style>
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

  h2 {
    margin-bottom: var(--space-16);
  }

  .scale-notes-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: var(--space-16);
  }

  .divider {
    margin-block: var(--space-16);
  }

  .chords-container {
    display: grid;
    gap: var(--space-8);
  }

  .chord-card {
    display: flex;
    align-items: center;
    gap: var(--space-16);

    padding: var(--space-12);
  }

  .pill {
    text-align: center;

    width: fit-content;
    min-width: 2em;
    padding: var(--space-4) var(--space-8);
    height: fit-content;

    background-color: var(--color-bg-accent-blue-light);
    border-radius: var(--radius-8);
  }

  .pill h3 {
    color: var(--color-text-accent-blue);
  }

  .pill[data-quality="Minor"] {
    background-color: var(--color-bg-accent-purple-light);

    & h3 {
      color: var(--color-text-accent-purple);
    }
  }

  .pill[data-quality="Diminished"] {
    background-color: var(--color-bg-accent-green-light);

    & h3 {
      color: var(--color-text-accent-green);
    }
  }
</style>
