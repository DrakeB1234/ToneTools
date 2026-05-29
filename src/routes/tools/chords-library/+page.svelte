<script lang="ts">
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { getSimpleChordsByCategory } from "$lib/helpers/musicTheory";
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
  import { chordCategories } from "$lib/helpers/musicTheoryConstants";
  import { onDestroy, onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import type {
    GeneralChord,
    SimpleChordEntry,
  } from "$lib/helpers/musicTheoryTypes";
  import Button from "$lib/components/UI/Button.svelte";
  import RootNoteInput from "$lib/components/RootNoteInput.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";

  // Page Specific Types

  interface uiState {
    inputNote: string;
    inputChordCategory: string;

    categoryChords: SimpleChordEntry[];
  }

  // State

  let uiState: uiState = $state({
    inputNote: "C",
    inputChordCategory: "Common",

    categoryChords: [],

    chordObj: {} as GeneralChord,
    pianoRollNotes: [],
    chordInversions: [],

    currentInversionSelected: 0,
  });

  // Functions

  function setData() {
    if (!uiState.inputNote || !uiState.inputChordCategory) return;

    const categoryChords = getSimpleChordsByCategory(
      uiState.inputChordCategory,
    );

    uiState.categoryChords = categoryChords;
  }

  function handleInputChange() {
    setData();
  }

  function handleChordCategoryButtonPressed(category: string) {
    uiState.inputChordCategory = category;

    setData();
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
        <RootNoteInput
          bind:value={uiState.inputNote}
          onChange={handleInputChange}
        />
      </div>

      <div class="toggle-buttons-container">
        {#each chordCategories as category (category)}
          <Button
            color="surface"
            variant="outline"
            active={uiState.inputChordCategory === category}
            onclick={() => handleChordCategoryButtonPressed(category)}
            >{category}</Button
          >
        {/each}
      </div>

      <div class="chord-categories-container">
        {#each uiState.categoryChords as chord (chord.symbol)}
          <Button
            element="a"
            color="surface"
            variant="outline"
            size="large"
            href={encodeUrlChord(uiState.inputNote, chord.symbol)}
          >
            <div class="chord-category-item">
              <h2 class="text-base">{uiState.inputNote + chord.symbol}</h2>
              <p class="caption muted">{chord.name}</p>
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

  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .toggle-buttons-container {
    display: flex;
    overflow-x: auto;
    gap: var(--space-8);

    padding-top: 2px;
    padding-bottom: var(--space-12);
    margin-top: var(--space-36);
  }

  .chord-categories-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    gap: var(--space-8);

    margin-top: var(--space-16);
  }

  .chord-category-item {
    display: grid;
    gap: var(--space-4);
  }

  @media (max-width: 768px) {
    .chord-categories-container {
      grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    }
  }
</style>
