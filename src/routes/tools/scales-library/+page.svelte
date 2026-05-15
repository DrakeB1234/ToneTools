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
    getNoteNamesCircleOfFifths,
    getModeDiatonicTriads,
    getScaleNotes,
    getNumeralsFromMode,
    getFormulaFromMode,
    getEnharmonicNote,
  } from "$lib/helpers/musicTheory";
  import { onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import type {
    GeneralChord,
    GeneralNote,
  } from "$lib/helpers/musicTheoryTypes";

  // Page Specific Types

  interface uiState {
    selectNoteValue: string;
    selectScaleValue: string;

    scaleNotes: GeneralNote[];
    scaleTriads: GeneralChord[];
    scaleNumerals: string[];
    scaleFormula: string[];

    pianoRollNotes: string[];
  }

  // Constants

  const selectNoteOptions: Option[] = getNoteNamesCircleOfFifths(true);
  const selectScaleOptions: Option[] = getAllModes();
  const initialSelectNoteValue = selectNoteOptions[0] as string;
  const initialSelectScaleValue = selectScaleOptions[0] as string;
  const startingOctave = 4;
  const playScaleDelayMs: number = 500;

  // State

  let uiState: uiState = $state({
    selectNoteValue: initialSelectNoteValue,
    selectScaleValue: initialSelectScaleValue,

    scaleNotes: [],
    scaleTriads: [],
    scaleNumerals: [],
    scaleFormula: [],
    pianoRollNotes: [],
  });
  let currentPlayedScaleIdx: number | null = $state(null);
  let playScaleInterval: ReturnType<typeof setInterval> | null = null;

  // Input Handlers

  const handleInputChange = () => {
    if (!uiState.selectNoteValue || !uiState.selectScaleValue) return;

    setScaleData();
  };

  // Methods for getting notes / data for page

  function setScaleData() {
    const notes = getScaleNotes(
      uiState.selectNoteValue,
      uiState.selectScaleValue,
      startingOctave,
    );
    const triads = getModeDiatonicTriads(
      uiState.selectNoteValue,
      uiState.selectScaleValue,
      startingOctave,
    );
    const numerals = getNumeralsFromMode(uiState.selectScaleValue);
    const formula = getFormulaFromMode(uiState.selectScaleValue);

    if (!notes || !triads || !numerals || !formula) {
      // Handle Error UI State
      uiState.selectNoteValue = initialSelectNoteValue;
      uiState.selectScaleValue = initialSelectScaleValue;
      return;
    }

    const pianoRollNotes = notes.map((e) => {
      return getEnharmonicNote(e.tonalJsName);
    });

    uiState = {
      ...uiState,
      scaleNotes: notes,
      scaleTriads: triads,
      scaleNumerals: numerals,
      scaleFormula: formula,
      pianoRollNotes: pianoRollNotes,
    };

    resetPlayScaleInterval();
  }

  // Audio player handlers

  function handlePlayNote(index: number) {
    const note = uiState.scaleNotes[index];

    pianoAudioService.playNote(note, "med");
  }

  function handlePlayChord(triadIndex: number) {
    const triad = uiState.scaleTriads[triadIndex];

    if (!triad) return;

    pianoAudioService.playChord(triad.notes, "med");
  }

  // Play Scale Interval - Play all notes in scale

  function resetPlayScaleInterval() {
    if (playScaleInterval) {
      clearInterval(playScaleInterval);
      playScaleInterval = null;
      currentPlayedScaleIdx = null;
    }
  }

  function handlePlayScale() {
    resetPlayScaleInterval();

    playScaleInterval = setInterval(() => {
      if (currentPlayedScaleIdx === null) currentPlayedScaleIdx = 0;
      if (currentPlayedScaleIdx >= uiState.scaleNotes.length)
        resetPlayScaleInterval();

      const currentNote = uiState.scaleNotes[currentPlayedScaleIdx];
      if (currentNote.octave) {
        pianoAudioService.playNote(currentNote, "low");
      }

      currentPlayedScaleIdx++;
    }, playScaleDelayMs);
  }

  // Svelte Methods

  onMount(() => {
    setScaleData();
    pianoAudioService.init();
  });
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
      <div class="scale-notes-header space-below">
        <h2 class="header-base">Scale Notes</h2>
        <Button onclick={handlePlayScale} variant="primary" size="icon">
          <MaterialIcon name="playArrow" />
        </Button>
      </div>
      <div class="scale-notes-container">
        {#each uiState.scaleNotes as note, index (note)}
          <Button
            onclick={() => handlePlayNote(index)}
            variant="text"
            class={currentPlayedScaleIdx === index + 1 ? "active" : ""}
            >{note.simplifiedFullName}</Button
          >
        {/each}
      </div>

      <div class="inner-card-base piano-roll-container">
        <PianoRoll
          visibleOctaves={2}
          startingOctave={4}
          activeNotes={uiState.pianoRollNotes}
        />
      </div>

      <hr class="divider" />

      <div class="inner-card-base">
        <h3 class="header-regular space-below">Numerals</h3>
        <p>
          {#each uiState.scaleNumerals as note, i (note)}
            {note}
            {#if i < uiState.scaleNumerals.length - 1}
              {" - "}
            {/if}
          {/each}
        </p>

        <hr class="divider" />

        <h3 class="header-regular space-below">
          Formula <span class="caption">(relative to major)</span>
        </h3>
        <p>
          {#each uiState.scaleFormula as note (note)}
            {note}&nbsp;&nbsp;
          {/each}
        </p>

        <hr class="divider" />
        <h3 class="header-regular space-below">Equivalent Modes</h3>
        <p class="caption">A Minor, D Dorian</p>
      </div>
    </section>

    <section class="card-base chords-card">
      <h2 class="header-base">Diatonic Chords</h2>

      <div class="chords-container">
        {#each uiState.scaleTriads as triadObj, index (triadObj.name)}
          <Button onclick={() => handlePlayChord(index)} variant="surface-dark">
            <div class="chord-card">
              <div class="pill" data-quality={triadObj.quality}>
                <h3>{uiState.scaleNumerals[index]}</h3>
              </div>
              <div class="text-container">
                <h3>{triadObj.name}</h3>
                <p class="caption muted">
                  {#each triadObj.notes as note, i (note)}
                    {note.simplifiedFullName}
                    {#if i < triadObj.notes.length - 1}
                      {" - "}
                    {/if}
                  {/each}
                </p>
              </div>
            </div>
          </Button>
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

  .scale-notes-header {
    display: flex;
    gap: var(--space-16);
    justify-content: space-between;
    align-items: center;
  }

  .space-below {
    margin-bottom: var(--space-16);
  }

  .text-container {
    display: flex;
    flex-direction: column;
    text-align: left;
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
    width: 100%;
  }

  .pill {
    text-align: center;

    width: 100%;
    max-width: 3em;
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
