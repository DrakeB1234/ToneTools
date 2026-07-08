<script lang="ts">
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { getAllCategoryChords } from "$lib/helpers/musicTheory";
  import { chordCategories } from "$lib/helpers/musicTheoryConstants";
  import Button from "$lib/components/UI/Button.svelte";
  import RootNoteInput from "$lib/components/RootNoteInput.svelte";
  import { encodeUrlChord } from "$lib/helpers/helpers";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";

  let inputNote = $state("C");
  let inputAccidental = $state("n");
  let inputChordCategory = $state("Common");
  let categoryChords = $derived(getAllCategoryChords(inputChordCategory) ?? []);

  let fullNote = $derived(
    inputNote + (inputAccidental === "n" ? "" : inputAccidental),
  );

  function handleChordCategoryButtonPressed(category: string) {
    inputChordCategory = category;
  }
</script>

<svelte:head>
  <title>Chords Library | Tone Tools</title>
</svelte:head>

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
          bind:noteValue={inputNote}
          bind:accidentalValue={inputAccidental}
        />
      </div>

      <div class="toggle-buttons-container">
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

      <div class="chord-categories-container">
        {#each categoryChords as chord (chord.symbol)}
          <InteractiveElement
            variant="outlined"
            style="padding: var(--space-12)"
            href={encodeUrlChord(fullNote, chord.symbol)}
            aria-label="Open link to see chord {fullNote + chord.symbol}"
          >
            <p>{fullNote + chord.symbol}</p>
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
