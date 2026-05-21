<script lang="ts">
  import Wrapper from "$lib/components/Wrapper.svelte";
  import Select, { type Option } from "$lib/components/UI/Select.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import {
    findChord,
    getAllChordInversions,
    getEnharmonicNote,
    getNoteNamesCircleOfFifths,
  } from "$lib/helpers/musicTheory";
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
  import { simpleChordSymbols } from "$lib/helpers/musicTheoryConstants";
  import { onDestroy, onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import type { GeneralChord } from "$lib/helpers/musicTheoryTypes";
  import Button from "$lib/components/UI/Button.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import PianoRoll from "$lib/components/PianoRoll.svelte";
  import ChordLibraryInversions from "$lib/components/ChordLibraryInversions.svelte";

  // Page Specific Types

  interface uiState {
    selectNoteValue: string;
    selectChordValue: string;

    chordObj: GeneralChord;
    pianoRollNotes: string[];
  }

  // Constants

  const selectNoteOptions: Option[] = getNoteNamesCircleOfFifths(true);
  const selectChordOptions: Option[] = simpleChordSymbols;
  const initialSelectNoteValue = selectNoteOptions[0] as string;
  const initialSelectChordValue = selectChordOptions[0] as string;
  const startingOctave = 4;

  // State

  let uiState: uiState = $state({
    selectNoteValue: initialSelectNoteValue,
    selectChordValue: initialSelectChordValue,

    chordObj: {} as GeneralChord,
    pianoRollNotes: [],
  });

  // Functions

  function setData() {
    if (!uiState.selectNoteValue || !uiState.selectChordValue) return;

    const chordObj = findChord(
      uiState.selectNoteValue,
      uiState.selectChordValue,
      startingOctave,
    );

    const pianoRollNotes = chordObj.notes.map((e) => {
      return getEnharmonicNote(e.tonalJsName);
    });

    uiState.chordObj = chordObj;
    uiState.pianoRollNotes = pianoRollNotes;
  }

  function handleInputChange() {
    setData();
  }

  function handlePlayNote(index: number) {
    const note = uiState.chordObj.notes[index];

    pianoAudioService.playNote(note, "med");
  }

  function handlePlayChord() {
    if (!uiState.chordObj.notes) return;

    pianoAudioService.playChord(uiState.chordObj.notes);
  }

  onMount(() => {
    setData();
    pianoAudioService.init();
  });

  onDestroy(() => {
    pianoAudioService.stopAll();
  });
</script>

<Wrapper>
  <main>
    <PageHeaderDetails subText="Tools" headerText="Chord Library" href="/" />

    <section class="card-base input-card">
      <div class="input-group">
        <Label labelFor="note">Note</Label>
        <Select
          id="note"
          options={selectNoteOptions}
          bind:value={uiState.selectNoteValue}
          onchange={handleInputChange}
        />
      </div>
      <div class="input-group">
        <Label labelFor="chord">Chord</Label>
        <Select
          id="chord"
          options={selectChordOptions}
          bind:value={uiState.selectChordValue}
          onchange={handleInputChange}
        />
      </div>
    </section>

    <section class="card-base chord-card">
      <div class="chord-header">
        <div>
          <h2 class="header-xlarge">
            {uiState.chordObj.tonic + uiState.chordObj.symbol}
          </h2>
          <p class="muted">{uiState.chordObj.name}</p>
        </div>
        <Button
          onclick={handlePlayChord}
          color="brand"
          variant="text"
          size="icon"
        >
          <MaterialIcon name="playArrow" />
        </Button>
      </div>

      <hr class="divider" />

      <div class="note-buttons-container">
        {#each uiState.chordObj.notes as note, index (note)}
          <Button
            onclick={() => handlePlayNote(index)}
            color="surface"
            variant="outline"
            size="large">{note.simplifiedFullName}</Button
          >
        {/each}
      </div>

      <div class="inner-card-base piano-roll-card">
        <PianoRoll
          startingOctave={4}
          activeNotes={uiState.pianoRollNotes}
          visibleOctaves={2}
        />
      </div>

      <hr class="divider" />

      <h3>Inversions</h3>
      <div class="inner-card-base">
        <p>inversion 1</p>
      </div>
      <Button
        onclick={() =>
          getAllChordInversions(
            uiState.selectNoteValue,
            uiState.chordObj.symbol,
          )}>TEST</Button
      >
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

  .input-card {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7em, 1fr));
    gap: var(--space-12);
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .chord-card {
    padding-block: var(--space-16);
  }

  .chord-header {
    display: flex;
    justify-content: space-between;
    align-items: start;

    margin-bottom: var(--space-12);
  }

  .note-buttons-container {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;

    margin-block: var(--space-12);
  }

  .piano-roll-card {
    margin-bottom: var(--space-16);
  }
</style>
