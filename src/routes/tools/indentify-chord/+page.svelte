<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import PianoInteractive from "$lib/components/Piano/PianoInteractive.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";
  import {
    convertMidiToNoteName,
    convertNoteNameToObj,
    getChordsByNoteNames,
  } from "$lib/helpers/musicTheory";
  import { onDestroy, onMount } from "svelte";

  let selectedNotes: string[] = $state([]);
  let identifiedChords = $derived(getChordsByNoteNames(selectedNotes));

  function handlePianoNoteClick(midi: number) {
    const noteName = convertMidiToNoteName(midi);

    if (noteName) {
      if (selectedNotes.includes(noteName)) {
        selectedNotes = selectedNotes.filter((n) => n !== noteName);
      } else {
        selectedNotes = [...selectedNotes, noteName];

        pianoAudioService.playNote(convertNoteNameToObj(noteName), "low");
      }
    }
  }

  // Svelte Methods

  onMount(() => {
    pianoAudioService.init();
  });

  onDestroy(() => {
    pianoAudioService.stopAll();
  });
</script>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Tools"
      headerText="Indentify Chord"
      fallbackHref="/"
    />

    <section class="card-base input-card">
      <PianoInteractive
        activeNotes={selectedNotes}
        range={{
          startNote: "C4",
          endNote: "E7",
        }}
        onNoteClick={handlePianoNoteClick}
      />

      <h2 class="text-body header">Selected Notes:</h2>
      <div class="notes-container">
        {#each selectedNotes as note}
          <p>{note}</p>
        {/each}
      </div>
    </section>

    <section class="card-base chords-card">
      <h2>Results</h2>
      <hr />
      <div class="chords-container">
        {#each identifiedChords as chord}
          <Button
            element="a"
            color="surface"
            variant="outline"
            size="large"
            href={encodeUrlChord(chord.tonic!, chord.symbol)}
          >
            <div class="chord-link">
              <p>{chord.tonic + chord.symbol}</p>
              <div class="notes-container">
                {#each selectedNotes as note}
                  <p class="muted">{note}</p>
                {/each}
              </div>
            </div>
          </Button>
        {:else}
          <div class="empty-container">
            <p class="muted">No chords found</p>
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

  .input-card {
    display: grid;

    width: 100%;
  }

  .header {
    margin-top: var(--space-24);
  }

  .notes-container {
    display: flex;
    gap: var(--space-8);
    flex-wrap: wrap;

    width: 100%;
    min-height: 21px;
    margin-top: var(--space-8);
  }

  .chords-card h2 {
    margin-bottom: var(--space-8);
  }

  .chords-container {
    display: grid;
    gap: var(--space-8);

    margin-top: var(--space-8);
  }

  .chord-link {
    display: grid;
  }

  .empty-container {
    display: flex;
    justify-content: center;

    padding: var(--space-16) var(--space-16);
  }
</style>
