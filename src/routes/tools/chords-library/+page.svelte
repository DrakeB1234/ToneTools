<script lang="ts">
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { getAllCategoryChords } from "$lib/helpers/musicTheory";
  import { chordCategories } from "$lib/helpers/musicTheoryConstants";
  import { onDestroy, onMount } from "svelte";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import type { GeneralChord } from "$lib/helpers/musicTheoryTypes";
  import Button from "$lib/components/UI/Button.svelte";
  import RootNoteInput from "$lib/components/RootNoteInput.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";

  // Page Specific Types

  interface uiState {
    inputNote: string;
    inputChordCategory: string;

    categoryChords: ReturnType<typeof getAllCategoryChords>;
  }

  // State

  let uiState: uiState = $state({
    inputNote: "C",
    inputChordCategory: "Common",

    categoryChords: [],

    chordObj: {} as GeneralChord,
    pianoRollNotes: [],

    currentInversionSelected: 0,
  });

  // Functions

  function setData() {
    if (!uiState.inputNote || !uiState.inputChordCategory) return;

    const categoryChords = getAllCategoryChords(uiState.inputChordCategory);

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
    <PageHeaderContainer
      subText="Tools"
      headerText="Chord Library"
      fallbackHref="/"
    />

    <section class="card">
      <div class="input-group">
        <RootNoteInput
          bind:value={uiState.inputNote}
          onChange={handleInputChange}
        />
      </div>

      <div class="toggle-buttons-container">
        {#each chordCategories as category (category)}
          <Button
            variant="outlined"
            state={uiState.inputChordCategory === category ? "on" : "off"}
            onclick={() => handleChordCategoryButtonPressed(category)}
            >{category}</Button
          >
        {/each}
      </div>

      <div class="chord-categories-container">
        {#each uiState.categoryChords as chord (chord.symbol)}
          <InteractiveElement
            variant="outlined"
            style="padding: var(--space-12)"
            href={encodeUrlChord(uiState.inputNote, chord.symbol)}
          >
            <p>{uiState.inputNote + chord.symbol}</p>
            <p class="text-body-muted">{chord.name}</p>
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

  @media (max-width: 768px) {
    .chord-categories-container {
      grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    }
  }
</style>
