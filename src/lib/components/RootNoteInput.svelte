<script lang="ts">
  import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
  import Button from "./UI/Button.svelte";
  import Label from "./UI/Label.svelte";

  let {
    value = $bindable(),
    onChange,
  }: {
    value: string;
    onChange?: () => void;
  } = $props();

  let activeNote = $derived(value?.charAt(0) || "C");
  let activeAccidental = $derived(value?.length > 1 ? value?.charAt(1) : "n");

  function handleNoteNamePressed(note: string) {
    const accidentalSuffix = activeAccidental === "n" ? "" : activeAccidental;
    value = note + accidentalSuffix;

    if (onChange) onChange();
  }

  function handleAccidentalPressed(accidental: string) {
    const accidentalSuffix = accidental === "n" ? "" : accidental;
    value = activeNote + accidentalSuffix;

    if (onChange) onChange();
  }
</script>

<div class="root-note-input-wrapper">
  <Label>Note</Label>
  <div class="note-buttons">
    {#each naturalNoteNames as note}
      <Button
        color="surface"
        variant="outline"
        shape="large"
        active={activeNote === note}
        onclick={() => handleNoteNamePressed(note)}
      >
        {note}
      </Button>
    {/each}
  </div>

  <Label>Accidental</Label>
  <div class="accidental-buttons">
    <Button
      color="surface"
      variant="outline"
      shape="large"
      active={activeAccidental === "n"}
      onclick={() => handleAccidentalPressed("n")}
    >
      n
    </Button>
    <Button
      color="surface"
      variant="outline"
      shape="large"
      active={activeAccidental === "#"}
      onclick={() => handleAccidentalPressed("#")}
    >
      #
    </Button>
    <Button
      color="surface"
      variant="outline"
      shape="large"
      active={activeAccidental === "b"}
      onclick={() => handleAccidentalPressed("b")}
    >
      b
    </Button>
  </div>
</div>

<style>
  .root-note-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .note-buttons,
  .accidental-buttons {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
</style>
