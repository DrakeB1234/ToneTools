<script lang="ts">
  import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
  import Button from "./UI/Button.svelte";
  import Label from "./UI/Label.svelte";

  let {
    noteValue = $bindable(),
    accidentalValue = $bindable(),
    onChange,
  }: {
    noteValue: string;
    accidentalValue: string;
    onChange?: () => void;
  } = $props();

  function handleNoteNamePressed(note: string) {
    noteValue = note;

    if (onChange) onChange();
  }

  function handleAccidentalPressed(accidental: string) {
    accidentalValue = accidental;

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
          state={noteValue === note ? "on" : "off"}
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
        state={accidentalValue === "n" ? "on" : "off"}
        onclick={() => handleAccidentalPressed("n")}
      >
        n
      </Button>
      <Button
        variant="secondary"
        state={accidentalValue === "#" ? "on" : "off"}
        onclick={() => handleAccidentalPressed("#")}
      >
        #
      </Button>
      <Button
        variant="secondary"
        state={accidentalValue === "b" ? "on" : "off"}
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
