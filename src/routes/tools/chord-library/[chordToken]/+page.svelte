<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
  import PianoRoll from "$lib/components/PianoRoll.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import {
    getAllChordInversions,
    getEnharmonicNote,
  } from "$lib/helpers/musicTheory";
  import { onDestroy, onMount } from "svelte";
  import type { PageProps } from "./$types";

  // Page Specific Types

  interface uiState {
    currentInversionSelected: number;
  }

  // Constants

  const startingOctave = 4;
  let { data }: PageProps = $props();

  // State

  let uiState: uiState = $state({
    currentInversionSelected: 0,
  });

  let chordObj = $derived(data.chordObj);
  let chordInversions = $derived(getAllChordInversions(data.chordObj));
  let pianoRollNotes = $derived(
    chordInversions[uiState.currentInversionSelected]?.notes.map(
      (n) => n.tonalJsName,
    ) || [],
  );

  $effect.pre(() => {
    data.chordObj;
    uiState.currentInversionSelected = 0;
  });

  // Functions

  function handlePlayNote(index: number) {
    const note = chordObj.notes[index];
    if (note.octave === null) return;

    const fixedOctave = note.octave + startingOctave;
    const newNote = {
      ...note,
      octave: fixedOctave,
      tonalJsName: note.letter + fixedOctave,
    };

    pianoAudioService.playNote(newNote, "med");
  }

  // Considers currently selected chord inversion, then plays those notes. Root inversion is set by default
  function handlePlayChord() {
    const selectedInversion = chordInversions[uiState.currentInversionSelected];
    selectedInversion.notes.forEach((e) => {
      if (e.octave === null) return;
      e.octave += startingOctave;
    });

    pianoAudioService.playChord(selectedInversion.notes);
  }

  function handleInversionPressed(i: number) {
    if (i >= chordInversions.length) {
      uiState.currentInversionSelected = 0;
      return;
    }

    const selectedInversion = chordInversions[i];

    const newPianoRollNotes = selectedInversion.notes.map((e) => {
      return getEnharmonicNote(e.tonalJsName);
    });

    pianoRollNotes = newPianoRollNotes;
    uiState.currentInversionSelected = i;
  }

  onMount(() => {
    pianoAudioService.init();
  });

  onDestroy(() => {
    pianoAudioService.stopAll();
  });
</script>

<Wrapper>
  <main>
    <PageHeaderDetails
      subText="Chord"
      headerText="Back"
      href="/tools/chord-library"
    />

    <section class="card-base chord-card">
      <div class="chord-header">
        <div>
          <h2 class="text-xlarge">
            {chordObj.tonic + chordObj.symbol}
          </h2>
          <p class="muted">{chordObj.name}</p>
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
        {#each chordObj.notes as note, index (note)}
          <Button
            onclick={() => handlePlayNote(index)}
            color="surface"
            variant="outline"
            size="large">{note.simplifiedFullName}</Button
          >
        {/each}
      </div>

      <div class="piano-roll-container">
        <PianoRoll
          startingOctave={0}
          activeNotes={pianoRollNotes}
          visibleOctaves={3}
        />
      </div>

      <hr class="divider" />

      <h3>Inversions</h3>
      <div class="inner-card-base inversions-container">
        {#each chordInversions as inversion, index (index)}
          <button
            class="btn inversion-button"
            class:active={uiState.currentInversionSelected === index}
            onclick={() => handleInversionPressed(index)}
          >
            <p>{inversion.name}</p>
            <div class="inversion-button-notes">
              {#each inversion.notes as note}
                <p class="muted">{note.simplifiedFullName}&nbsp;</p>
              {/each}
            </div>
          </button>
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

  .piano-roll-container {
    margin-block: var(--space-16);
  }

  .inversions-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);

    padding: 0;
    margin-top: var(--space-16);
  }

  .inversion-button {
    display: flex;
    flex-direction: column;
    align-items: start;

    padding: var(--space-12);

    background-color: transparent;
  }

  .inversion-button.active {
    background-color: var(--color-bg-brand);

    * {
      color: var(--color-text-inverse);
    }
  }

  .inversion-button-notes {
    display: flex;
  }

  .inversion-button:not(.active):hover {
    background-color: var(--color-surface-hover);
  }
</style>
