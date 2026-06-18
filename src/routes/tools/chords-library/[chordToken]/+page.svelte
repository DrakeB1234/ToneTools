<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onDestroy, onMount } from "svelte";
  import type { PageProps } from "./$types";
  import PianoSnapshot from "$lib/components/Piano/PianoSnapshot.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import {
    getFullNoteNameFromObj,
    simplifyNoteName,
  } from "$lib/helpers/musicTheory";
  import Toggle from "$lib/components/UI/Toggle.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import LinkCard from "$lib/components/Cards/LinkCard.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";

  // Constants

  const startingOctave = 4;
  let { data }: PageProps = $props();

  // Data

  const chordObj = $derived(data.chordObj);
  const chordInversions = $derived(data.chordInversions);
  const chordIntervals = $derived(data.chordIntervals);
  const chordAliases = $derived(data.chordAliases);
  const similarChords = $derived(data.similarChords);
  const secondaryDominantChord = $derived(data.secondaryDominantChord);

  let isChordInversions = $derived(data.chordInversions !== null);
  let isSimplifyNotesSelected = $state(false);
  let currentInversionSelected = $state(0);
  let pianoSnapshotNotes = $derived(data.fullNoteNames);

  // Functions

  function handlePlayNote(index: number) {
    const note = chordObj.notes[index];
    if (note.octave === null) return;

    pianoAudioService.playNote(note, "med");
  }

  // Considers currently selected chord inversion, then plays those notes. Root inversion is set by default
  function handlePlayChord() {
    if (!chordInversions) {
      pianoAudioService.playChord(chordObj.notes);
    } else {
      pianoAudioService.playChord(
        chordInversions[currentInversionSelected].chord.notes,
      );
    }
  }

  function handleInversionPressed(i: number) {
    if (!chordInversions) return;

    currentInversionSelected = i;
    const selectedInversionNotes = chordInversions[i].chord.notes;
    const noteFullNames = selectedInversionNotes.map((e) =>
      getFullNoteNameFromObj(e),
    );

    pianoSnapshotNotes = noteFullNames;
  }

  onMount(() => {
    pianoAudioService.init();
  });

  onDestroy(() => {
    pianoAudioService.stopAll();
  });
</script>

<svelte:head>
  <title>{data.chordObj.tonic}{data.chordObj.symbol} Chord | Music App</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Chord"
      headerText="Back"
      fallbackHref="/tools/chords-library"
    />

    <section class="card-base chord-card">
      <div class="chord-header">
        <div>
          <h1>
            {chordObj.tonic + chordObj.symbol}
          </h1>
          <p class="text-body-muted">{chordObj.name}</p>
        </div>
        <Button
          onclick={handlePlayChord}
          color="brand"
          variant="text"
          shape="small"
        >
          <Icon icon="volumeUp" />
        </Button>
      </div>

      <div class="flex-container aliases-container">
        {#each chordAliases as alias (alias)}
          <p class="pill surface-dark">{alias}</p>
        {/each}
      </div>

      <div class="toggle-button-container space-above">
        <Label labelFor="simplify-notes">Simplify Notes</Label>
        <Toggle
          bind:toggled={isSimplifyNotesSelected}
          id="simplify-notes"
          ariaLabel="Enable Simplified Notes"
        />
      </div>

      <hr class="divider space-above" />

      <div class="note-buttons-container">
        {#each chordObj.notes as note, index (note)}
          {@const rawNote = note.letter + note.accidental}
          {@const displayNote = isSimplifyNotesSelected
            ? simplifyNoteName(rawNote)
            : rawNote}

          <Button
            onclick={() => handlePlayNote(index)}
            color="surface"
            variant="outline"
            shape="large"
          >
            {displayNote}
          </Button>
        {/each}
      </div>

      <div class="piano-roll-container">
        <PianoSnapshot
          activeNotes={pianoSnapshotNotes}
          range={{
            startNote: "C4",
            endNote: "E6",
          }}
        />
      </div>

      <div class="inner-card-base">
        <h3>Intervals</h3>
        <div class="flex-container">
          {#each chordIntervals as interval (interval)}
            <p class="text-body-muted">{interval}</p>
          {/each}
        </div>
        <h3 class="space-above">
          Secondary Dominant <span class="text-body-muted"
            >(perfect 5th above root)</span
          >
        </h3>
        <p class="text-body-muted">
          {secondaryDominantChord?.tonic}{secondaryDominantChord?.symbol}
        </p>
      </div>

      <hr class="divider" />

      {#if isChordInversions}
        <h3 class="space-above">Inversions</h3>
        <div class="inversions-container">
          {#each chordInversions as inversion, index (index)}
            <InteractiveElement
              variant="outline"
              activeStyle="active-style-2"
              active={currentInversionSelected === index}
              onclick={() => handleInversionPressed(index)}
            >
              <div class="inversion-button-container">
                <div class="inversion-top-container">
                  <p class="pill inversion-pill">{inversion.inversionName}</p>
                </div>
                <div class="inversion-bottom-container">
                  <p>{inversion.chord.tonic + inversion.chord.symbol}</p>
                  <div class="inversion-button-notes">
                    {#each inversion.chord.notes as note}
                      {@const rawNote = note.letter + note.accidental}
                      {@const displayNote = isSimplifyNotesSelected
                        ? simplifyNoteName(rawNote)
                        : rawNote}

                      <p class="text-body-muted">
                        {displayNote}&nbsp;
                      </p>
                    {/each}
                  </div>
                </div>
              </div>
            </InteractiveElement>
          {/each}
        </div>
      {/if}
    </section>

    <section class="card-base">
      <h3>Similar Chords</h3>

      <div class="similar-chords-container">
        {#each similarChords as chord}
          <LinkCard
            header={chord.tonic + chord.symbol}
            subTextItems={chord.name}
            href={encodeUrlChord(chord.tonic!, chord.symbol)}
          />
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

  .aliases-container {
    overflow-x: auto;
  }

  .note-buttons-container {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;

    margin-block: var(--space-12);
  }

  .piano-roll-container {
    width: 100%;
    overflow-x: auto;

    margin-block: var(--space-16);
  }

  .inner-card-base {
    margin-bottom: var(--space-16);
  }

  .flex-container {
    display: flex;
    gap: var(--space-8);
  }

  .toggle-button-container {
    width: fit-content;
    margin-left: auto;
  }

  .inversions-container {
    display: grid;
    gap: var(--space-8);

    padding: 0;
    margin-top: var(--space-8);
  }

  .inversion-button-container {
    display: flex;
    gap: var(--space-12);

    padding: var(--space-12);
  }

  .inversion-top-container {
    display: flex;
    justify-content: space-between;
  }

  .inversion-bottom-container {
    display: grid;
  }

  .inversion-button-notes {
    display: flex;
  }

  .inversion-pill {
    width: 5ch;
  }

  .similar-chords-container {
    display: grid;
    gap: var(--space-8);

    margin-top: var(--space-16);
  }
</style>
