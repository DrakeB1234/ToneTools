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
    getChordNotes,
    simplifyNoteAccidental,
  } from "$lib/helpers/musicTheory";
  import { onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";

  const _getScaleNotes = (root: string, scaleType: string): string[] | null => {
    const notes = getScaleNotes(root, scaleType);

    if (!notes) {
      console.error(`Invalid scale provided: ${root}, ${scaleType}`);
      return null;
    }

    const simplifiedNotes = notes.map((e) => {
      return simplifyNoteAccidental(e) ?? "";
    });

    return simplifiedNotes;
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

  const getOctaveNotes = (root: string, scaleType: string): string[] | null => {
    const initialNotes = getScaleNotes(root, scaleType, startingOctave);

    if (!initialNotes) {
      console.error(
        `Invalid scale provided: ${root}, ${scaleType}, ${startingOctave}`,
      );
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
    octaveNotes: string[];
  }

  const startingOctave = 4;

  const selectNoteOptions: Option[] = getNoteNamesCircleOfFifths(true);
  const selectScaleOptions: Option[] = getAllModes();

  const initialSelectNoteValue = selectNoteOptions[0] as string;
  const initialSelectScaleValue = selectScaleOptions[0] as string;

  const playScaleDelayMs: number = 500;
  let playScaleInterval: ReturnType<typeof setInterval> | null = null;
  let currentPlayedScaleIdx: number | null = $state(null);

  let uiState: uiState = $state({
    selectNoteValue: initialSelectNoteValue,
    selectScaleValue: initialSelectScaleValue,

    scaleNotes:
      _getScaleNotes(initialSelectNoteValue, initialSelectScaleValue) ?? [],
    scaleTriads:
      _getScaleTriads(initialSelectNoteValue, initialSelectScaleValue) ?? [],
    scaleNumerals: getNumeralsFromMode(initialSelectScaleValue) ?? [],
    scaleFormula: getFormulaFromMode(initialSelectScaleValue) ?? [],
    octaveNotes:
      getOctaveNotes(initialSelectNoteValue, initialSelectScaleValue) ?? [],
  });

  const handleInputChange = () => {
    const notes = _getScaleNotes(
      uiState.selectNoteValue,
      uiState.selectScaleValue,
    );
    const pianoRollNotes = getOctaveNotes(
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
      octaveNotes: pianoRollNotes,
      scaleTriads: triads,
      scaleNumerals: numerals,
      scaleFormula: formula,
    };
  };

  function handlePlayNote(note: string) {
    pianoAudioService.playNote(note);
  }

  // Uses the octave notes already stored in the uiState obj for tonal.js to determine the correct octaved notes to
  // play in a chord. The triadIndex corresponds to the 'tonic' of the chord, which with combined the octave on that tonic
  // will play a chord with the correct 'ascending' notes in the diatonic chords
  function handlePlayChord(triadIndex: number) {
    const triad = uiState.scaleTriads[triadIndex];
    const startingOctavedNote = uiState.octaveNotes[triadIndex];

    if (!triad || !startingOctavedNote) return;

    const octaveNotes = getChordNotes(triad.chordName, startingOctavedNote);

    pianoAudioService.playChord(octaveNotes);
  }

  function handlePlayScale() {
    if (playScaleInterval) {
      clearInterval(playScaleInterval);
      playScaleInterval = null;
      currentPlayedScaleIdx = null;
    }

    currentPlayedScaleIdx = 0;

    playScaleInterval = setInterval(() => {
      if (
        currentPlayedScaleIdx === null ||
        currentPlayedScaleIdx >= uiState.octaveNotes.length
      ) {
        clearInterval(playScaleInterval!);
        playScaleInterval = null;
        currentPlayedScaleIdx = null;
        return;
      }

      pianoAudioService.playNote(uiState.octaveNotes[currentPlayedScaleIdx]);
      currentPlayedScaleIdx++;
    }, playScaleDelayMs);
  }

  onMount(() => {
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
            onclick={() => handlePlayNote(uiState.octaveNotes[index])}
            variant="text">{note}</Button
          >
        {/each}
      </div>

      <div class="inner-card-base piano-roll-container">
        <PianoRoll
          visibleOctaves={2}
          startingOctave={4}
          activeNotes={uiState.octaveNotes}
        />
      </div>

      <hr class="divider" />

      <div class="inner-card-base">
        <h2 class="header-base space-below">Numerals</h2>
        <p>
          {#each uiState.scaleNumerals as note, i (note)}
            {note}
            {#if i < uiState.scaleNumerals.length - 1}
              {" - "}
            {/if}
          {/each}
        </p>

        <hr class="divider" />

        <h2 class="header-base space-below">
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
        {#each uiState.scaleTriads as triadObj, index (triadObj.chordName)}
          <Button onclick={() => handlePlayChord(index)} variant="surface-dark">
            <div class="chord-card">
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
