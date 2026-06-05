<script lang="ts">
  import Button from "$lib/components/UI/Button.svelte";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onDestroy, onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
  import type { PageProps } from "./$types";
  import PianoSnapshot from "$lib/components/Piano/PianoSnapshot.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";

  // Constants

  const playScaleDelayMs: number = 500;
  let playScaleInterval: ReturnType<typeof setInterval> | null = null;
  let currentPlayedScaleIdx: number | null = $state(null);

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

    playScaleInterval = setInterval(() => {
      if (currentPlayedScaleIdx === null) currentPlayedScaleIdx = 0;
      if (currentPlayedScaleIdx >= data.scaleNotes.length) {
        resetPlayScaleInterval();
        return;
      }

      const currentNote = data.scaleNotes[currentPlayedScaleIdx];
      if (currentNote.octave) {
        pianoAudioService.playNote(currentNote, "low");
      }

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
    <PageHeaderDetails
      subText="Scale"
      headerText="Back"
      href="/tools/scales-library"
    />

    <section class="card-base scale-card">
      <div class="scale-notes-header space-below">
        <h2 class="text-xlarge">
          {data.noteToken}&nbsp;{data.scaleToken}
        </h2>
        <Button
          onclick={handlePlayScale}
          color="brand"
          variant="text"
          size="icon"
        >
          <MaterialIcon name="playArrow" />
        </Button>
      </div>
      <div class="scale-notes-container">
        {#each data.scaleNotes as note, index (note)}
          <Button
            onclick={() => handlePlayNote(index)}
            color="surface"
            variant="outline"
            size="large"
            active={currentPlayedScaleIdx === index + 1}
            >{note.letter + note.accidental}</Button
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
        <h3 class="text-regular space-below">Numerals</h3>
        <p>
          {#each data.numerals as note, i (note)}
            {note}
            {#if i < data.numerals.length - 1}
              {" - "}
            {/if}
          {/each}
        </p>

        <hr class="divider" />

        <h3 class="text-regular space-below">
          Formula <span class="caption">(relative to major)</span>
        </h3>
        <p>
          {#each data.formula as note (note)}
            {note}&nbsp;&nbsp;
          {/each}
        </p>

        <hr class="divider" />
        <h3 class="text-regular space-below">Relative Modes</h3>
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
              <div class="pill" data-quality={triadObj.quality}>
                <h3>{data.numerals[index]}</h3>
              </div>
              <div class="text-container">
                <h3>{triadObj.name}</h3>
                <p class="caption muted">
                  {#each triadObj.notes as note, i (note)}
                    {note.letter + note.accidental}
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

    margin-bottom: var(--space-16);
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
    text-align: center;

    width: 100%;
    max-width: 3em;
    padding: var(--space-4) var(--space-8);
    height: fit-content;

    background-color: var(--color-deco-blue-light);
    border-radius: var(--radius-8);
  }

  .pill h3 {
    color: var(--color-deco-blue-dark);
  }

  .pill[data-quality="Minor"] {
    background-color: var(--color-deco-purple-light);

    & h3 {
      color: var(--color-deco-purple-dark);
    }
  }

  .pill[data-quality="Diminished"] {
    background-color: var(--color-deco-green-light);

    & h3 {
      color: var(--color-deco-green-dark);
    }
  }
</style>
