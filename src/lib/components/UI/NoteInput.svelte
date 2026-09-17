<script lang="ts">
  import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
  import Button from "./Button.svelte";
  import Label from "./Label.svelte";
  import Toggle from "./Toggle.svelte";

  let { activeNote = $bindable(""), hideEnharmonics = true } = $props();

  // Use the $state rune for reactivity
  let preferFlats = $state(true);

  function handlePreferFlatsClick() {
    preferFlats = !preferFlats;

    // change input to match
  }

  function handleNoteClick(note: string) {
    activeNote = note;
  }

  const enharmonicIndexesSharp = [2, 6];
  const enharmonicIndexesFlat = [0, 3];
  const currentEnharmonicIndexes = $derived(
    preferFlats ? enharmonicIndexesFlat : enharmonicIndexesSharp,
  );
</script>

<div class="note-input">
  <div class="note-input__top flex-row">
    <span class="text-caption">Note</span>
    <div class="flex-row lay-gap-xsm">
      <Label labelFor="prefer-flats" style="font-size: var(--font-size-base)"
        >♭</Label
      >
      <Toggle
        id="prefer-flats"
        toggled={preferFlats}
        ontoggle={handlePreferFlatsClick}
        size="small"
        ariaLabel="Toggle Prefer Flats"
      />
    </div>
  </div>

  <div class="note-buttons flex-col space-above-base">
    <div class="note-buttons__container flex-row">
      {#each naturalNoteNames as note, i}
        {#if hideEnharmonics && currentEnharmonicIndexes.includes(i)}
          <span class="note-buttons__space"></span>
        {:else}
          {@const fullNote = `${note}${preferFlats ? "b" : "#"}`}

          <Button
            variant="outlined"
            class="exercise-btn"
            state={activeNote === fullNote ? "on" : "off"}
            onclick={() => handleNoteClick(fullNote)}
          >
            {fullNote}
          </Button>
        {/if}
      {/each}
    </div>

    <div class="note-buttons__container flex-row">
      {#each naturalNoteNames as note}
        <Button
          variant="outlined"
          class="exercise-btn"
          state={activeNote === note ? "on" : "off"}
          onclick={() => handleNoteClick(note)}
        >
          {note}
        </Button>
      {/each}
    </div>
  </div>
</div>

<style>
  .note-input {
    width: 100%;
    max-width: calc((var(--space-4) * 6) + 40px * 7);
  }

  .note-input__top {
    justify-content: space-between;
  }

  .note-buttons__space {
    width: calc(100% + 1em);
    aspect-ratio: 1;
  }

  .note-buttons__container :global(.exercise-btn) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    padding-inline: 0;
  }
</style>
