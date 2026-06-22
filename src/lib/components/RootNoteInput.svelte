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

<div class="lay-col">
  <div class="lay-input-label-col">
    <Label>Note</Label>
    <div class="note-buttons lay-row">
      {#each naturalNoteNames as note}
        <Button
          variant="secondary"
          state={activeNote === note ? "on" : "off"}
          onclick={() => handleNoteNamePressed(note)}
        >
          {note}
        </Button>
      {/each}
    </div>
  </div>

  <div class="lay-input-label-col">
    <Label>Accidental</Label>
    <div class="accidental-buttons lay-row">
      <Button
        variant="secondary"
        state={activeAccidental === "n" ? "on" : "off"}
        onclick={() => handleAccidentalPressed("n")}
      >
        n
      </Button>
      <Button
        variant="secondary"
        state={activeAccidental === "#" ? "on" : "off"}
        onclick={() => handleAccidentalPressed("#")}
      >
        #
      </Button>
      <Button
        variant="secondary"
        state={activeAccidental === "b" ? "on" : "off"}
        onclick={() => handleAccidentalPressed("b")}
      >
        b
      </Button>
    </div>
  </div>
</div>

<style>
  .note-buttons,
  .accidental-buttons {
    flex-wrap: wrap;
  }
</style>
