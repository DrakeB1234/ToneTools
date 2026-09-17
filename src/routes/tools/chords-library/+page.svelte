<script lang="ts">
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { getAllCategoryChords } from "$lib/helpers/musicTheory";
  import { chordCategories } from "$lib/helpers/musicTheoryConstants";
  import Button from "$lib/components/UI/Button.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";
  import { onMount } from "svelte";
  import { lastUsedService } from "$lib/data/lastUsedService.svelte";
  import { page } from "$app/state";
  import NoteInput from "$lib/components/UI/NoteInput.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";

  let inputNote = $state("C");
  let inputChordCategory = $state("Common");
  let categoryChords = $derived(getAllCategoryChords(inputChordCategory) ?? []);

  function handleChordCategoryButtonPressed(category: string) {
    inputChordCategory = category;
  }

  onMount(() => {
    // Save url for last used data
    lastUsedService.addLastUsed(page.url.pathname);
  });
</script>

<svelte:head>
  <title>Chords Library | Tone Tools</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer headerText="Chords Library" fallbackHref="/" />

    <section class="card">
      <NoteInput bind:activeNote={inputNote} hideEnharmonics={false} />

      <div class="toggle-buttons-container space-above-xlg">
        {#each chordCategories as category (category)}
          <Button
            variant="outlined"
            state={inputChordCategory === category ? "on" : "off"}
            onclick={() => handleChordCategoryButtonPressed(category)}
            aria-label="Show chords under category {category}"
            >{category}</Button
          >
        {/each}
      </div>
    </section>

    <div class="chord-categories-container">
      {#each categoryChords as chord (chord.symbol)}
        <Button
          element="a"
          variant="outlined"
          href={encodeUrlChord(inputNote, chord.symbol)}
          class="lay-justify-start"
        >
          <div class="chord-button flex-col lay-gap-none">
            <p>{inputNote + chord.symbol}</p>
            <p class="text-body-subtle text-truncate">{chord.name}</p>
          </div>
        </Button>
      {/each}
    </div>
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

  .toggle-buttons-container {
    display: flex;
    overflow-x: auto;
    width: 100%;
    gap: var(--space-8);

    padding-bottom: var(--space-8);
  }

  .chord-categories-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);

    margin-top: var(--space-16);
  }

  .chord-button {
    align-items: start;
    padding: var(--space-8);
    overflow: hidden;
  }

  .chord-button p {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .chord-categories-container {
      grid-template-columns: 1fr;
    }
  }
</style>
