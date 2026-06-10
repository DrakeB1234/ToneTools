<script lang="ts">
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onDestroy, onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import type { PageProps } from "./$types";
  import PianoSnapshot from "$lib/components/Piano/PianoSnapshot.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Toggle from "$lib/components/UI/Toggle.svelte";
  import { simplifyNoteName } from "$lib/helpers/musicTheory";

  // Values

  const playScaleDelayMs: number = 500;
  let playScaleInterval: ReturnType<typeof setInterval> | null = $state(null);
  let currentPlayedScaleIdx: number | null = $state(null);

  let isSimplifyNotesSelected = $state(false);

  let { data }: PageProps = $props();

  // Audio player handlers

  function handlePlayNote(index: number) {
    const note = data.scaleNotes[index];

    pianoAudioService.playNote(note, "med");
  }

  function handlePlayChord(triadIndex: number) {
    const triad = data.triads[triadIndex];

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

    // Start playing first note at call
    pianoAudioService.playNote(data.scaleNotes[0], "low");
    currentPlayedScaleIdx = 1;

    playScaleInterval = setInterval(() => {
      if (currentPlayedScaleIdx === null) currentPlayedScaleIdx = 1;
      if (currentPlayedScaleIdx >= data.scaleNotes.length) {
        resetPlayScaleInterval();
        return;
      }

      const currentNote = data.scaleNotes[currentPlayedScaleIdx];
      pianoAudioService.playNote(currentNote, "low");

      currentPlayedScaleIdx++;
    }, playScaleDelayMs);
  }

  // Svelte Methods

  onMount(() => {
    pianoAudioService.init();
  });

  onDestroy(() => {
    resetPlayScaleInterval();
    pianoAudioService.stopAll();
  });
</script>

<svelte:head>
  <title>{data.noteToken}&nbsp;{data.scaleToken} | Music App</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Scale"
      headerText="Back"
      fallbackHref="/tools/scales-library"
    />

    <section class="card-base scale-card">
      <div class="scale-notes-header space-below">
        <div>
          <h1>{data.noteToken}&nbsp;{data.scaleToken}&nbsp;Scale</h1>
        </div>
        <Button
          onclick={handlePlayScale}
          color="brand"
          variant="outline"
          shape="small"
          disabled={playScaleInterval}
        >
          <Icon icon="volumeUp" />
        </Button>
      </div>
      <div class="toggle-button-container space-above-large">
        <Label labelFor="simplify-notes">Simplify Notes</Label>
        <Toggle
          bind:toggled={isSimplifyNotesSelected}
          id="simplify-notes"
          ariaLabel="Enable Simplified Notes"
        />
      </div>

      <hr class="space-above" />

      <div class="scale-notes-container">
        {#each data.scaleNotes as note, index (note)}
          {@const rawNote = note.letter + note.accidental}
          {@const displayNote = isSimplifyNotesSelected
            ? simplifyNoteName(rawNote)
            : rawNote}

          <Button
            onclick={() => handlePlayNote(index)}
            color="surface"
            variant="outline"
            shape="large"
            active={currentPlayedScaleIdx === index + 1}>{displayNote}</Button
          >
        {/each}
      </div>

      <div class="piano-roll-container">
        <PianoSnapshot
          activeNotes={data.pianoRollNotes}
          range={{
            startNote: "C4",
            endNote: "B5",
          }}
        />
      </div>

      <hr class="divider" />

      <div class="inner-card-base">
        <h3 class="text-heading-3 space-below">Numerals</h3>
        <p>
          {#each data.numerals as note, i (note)}
            {note}
            {#if i < data.numerals.length - 1}
              {" - "}
            {/if}
          {/each}
        </p>

        <hr class="divider" />

        <h3 class="text-heading-3 space-below">
          Formula <span class="text-caption">(relative to major)</span>
        </h3>
        <p>
          {#each data.formula as note (note)}
            {note}&nbsp;&nbsp;
          {/each}
        </p>

        <hr class="divider" />
        <h3 class="text-heading-3 space-below">Relative Modes</h3>
        <p>
          {data.relativeModes?.majorMode}&nbsp;|&nbsp;{data.relativeModes
            ?.minorMode}
        </p>
      </div>
    </section>

    <section class="card-base diatonic-card">
      <h2 class="space-below">Diatonic Chords</h2>

      <div class="inner-card-base chords-container">
        {#each data.triads as triadObj, index (triadObj.name)}
          <InteractiveElement
            variant="text"
            onclick={() => handlePlayChord(index)}
          >
            <div class="chord-button">
              <h3 class="pill">{data.numerals[index]}</h3>
              <div class="text-container">
                <h3>{triadObj.tonic + triadObj.symbol}</h3>
                <p class="text-caption-muted">
                  {#each triadObj.notes as note, i (note)}
                    {@const rawNote = note.letter + note.accidental}
                    {@const displayNote = isSimplifyNotesSelected
                      ? simplifyNoteName(rawNote)
                      : rawNote}

                    {displayNote}
                    {#if i < triadObj.notes.length - 1}
                      {" - "}
                    {/if}
                  {/each}
                </p>
              </div>
            </div>
          </InteractiveElement>
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

  .space-below {
    margin-bottom: var(--space-12);
  }

  .text-container {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .scale-card {
    padding-block: var(--space-16);
  }

  .toggle-button-container {
    width: fit-content;
    margin-left: auto;
  }

  .scale-notes-header {
    display: flex;
    gap: var(--space-16);
    justify-content: space-between;
    align-items: center;
  }

  .scale-notes-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);

    margin-block: var(--space-16);
  }

  .piano-roll-container {
    width: 100%;
    padding-bottom: var(--space-4);

    overflow-x: auto;
  }

  .divider {
    margin-block: var(--space-16);
  }

  .diatonic-card {
    padding-block: var(--space-16);
  }

  .chords-container {
    display: grid;
    gap: var(--space-8);
    padding: 0;
    margin-top: var(--space-16);

    background-color: transparent;
  }

  .chord-button {
    display: flex;
    align-items: center;
    gap: var(--space-16);
    background-color: transparent;

    padding: var(--space-12);
    width: 100%;
  }
  .chord-button:hover {
    background-color: var(--color-surface-hover);
  }

  .pill {
    min-width: 4ch;
  }
</style>
