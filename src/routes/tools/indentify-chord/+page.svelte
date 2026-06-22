<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import PianoInteractive from "$lib/components/Piano/PianoInteractive.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";
  import {
    convertMidiToNoteName,
    convertNoteNameToObj,
    detectChordsByNoteNames,
  } from "$lib/helpers/musicTheory";
  import { onDestroy, onMount } from "svelte";

  let selectedNotes: string[] = $state([]);
  let identifiedChords = $derived(detectChordsByNoteNames(selectedNotes));

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

    <section class="card">
      <PianoInteractive
        activeNotes={selectedNotes}
        range={{
          startNote: "C4",
          endNote: "E7",
        }}
        onNoteClick={handlePianoNoteClick}
      />

      <div class="card-content space-above-base">
        <p>Selected Notes:</p>
        <div class="notes-container lay-row">
          {#each selectedNotes as note}
            <p>{note}</p>
          {/each}
        </div>
      </div>
    </section>

    <section class="lay-col space-above-base">
      <h3>Results</h3>
      <hr />
      <div class="chords-container">
        {#each identifiedChords as chord}
          <InteractiveElement
            variant="card"
            style="border-radius: var(--radius-base);"
            href={encodeUrlChord(chord.tonic!, chord.symbol)}
          >
            <p>{chord.tonic + chord.symbol}</p>
            <div class="notes-container lay-row">
              {#each chord.notes as note (note)}
                <p class="text-body-muted">{note}</p>
              {/each}
            </div>
          </InteractiveElement>
        {:else}
          <div class="empty-container">
            <p class="text-body-muted">No chords found</p>
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

  .card {
    padding: 0;
    padding-bottom: var(--space-8);
  }

  .card-content {
    padding: var(--space-12);
  }

  .notes-container {
    flex-wrap: wrap;
    gap: var(--space-4);

    width: 100%;
    min-height: 21px;
    margin-top: var(--space-8);
  }

  .chords-container {
    display: grid;
    gap: var(--space-8);

    margin-top: var(--space-8);
  }

  .empty-container {
    display: flex;
    justify-content: center;

    padding: var(--space-12) var(--space-16);
  }
</style>
