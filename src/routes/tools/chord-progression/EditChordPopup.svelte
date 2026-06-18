<script lang="ts">
  import "$lib/components/Popups/popup.css";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import InteractiveElement from "$lib/components/UI/Button.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import StepperInput from "$lib/components/UI/StepperInput.svelte";
  import {
    findChord,
    getAccidentalFromNoteName,
    getLetterFromNoteName,
  } from "$lib/helpers/musicTheory";
  import {
    accidentalNames,
    naturalNoteNames,
    simpleChordSymbols,
  } from "$lib/helpers/musicTheoryConstants";
  import type {
    DiatonicChordSet,
    GeneralChord,
  } from "$lib/helpers/musicTheoryTypes";
  import type { ProgressionPlayer } from "./chordProgressionPlayer.svelte";
  import Button from "$lib/components/UI/Button.svelte";

  type Props = {
    progressionIdx: number;
    playerRef: ProgressionPlayer;
    diatonicChords: DiatonicChordSet[] | null;
    onComplete: () => void;
  };

  let { progressionIdx, playerRef, diatonicChords, onComplete }: Props =
    $props();

  let localBeats = $state(4);
  let localChordInfo = $state<GeneralChord | null>(null);

  let chordName = $derived(
    localChordInfo ? localChordInfo.tonic + localChordInfo.symbol : "",
  );
  let chordTonicLetter = $derived(
    localChordInfo ? getLetterFromNoteName(localChordInfo.tonic) : "",
  );
  let chordTonicAccidental = $derived(
    localChordInfo ? getAccidentalFromNoteName(localChordInfo.tonic) : "n",
  );
  let chordSymbol = $derived(localChordInfo ? localChordInfo.symbol : "");

  function onStepperChangeDuration(direction: number) {
    let newValue = localBeats + direction;

    if (newValue < 1 || newValue > 8) return;

    localBeats = newValue;
  }

  function onChordLetterChange(
    e: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) {
    const value = e.currentTarget.value;
    if (!value || !naturalNoteNames.includes(value)) return;

    const noteName = value + chordTonicAccidental;

    localChordInfo = findChord(noteName, chordSymbol);
  }

  function onChordAccidentalChange(
    e: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) {
    const value = e.currentTarget.value;
    if (!value || !accidentalNames.includes(value)) return;

    let fixedValue = value;
    if (fixedValue === "n") fixedValue = "";

    const noteName = chordTonicLetter + fixedValue;

    localChordInfo = findChord(noteName, chordSymbol);
  }

  function onChordSymbolChange(
    e: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) {
    const value = e.currentTarget.value;
    if (!value || !simpleChordSymbols.includes(value)) return;

    const noteName = chordTonicLetter + chordTonicAccidental.replace("n", "");

    const foundChord = findChord(noteName, value);
    if (foundChord) localChordInfo = foundChord;
  }

  function onDiatonicChordSelect(degree: number, chordIdx: number) {
    const selectedChord = diatonicChords![degree].chords[chordIdx];

    if (!selectedChord) return;
    const foundChordObj = findChord(selectedChord.tonic, selectedChord.symbol);
    if (!foundChordObj) return;

    localChordInfo = foundChordObj;
  }

  function applyChanges() {
    playerRef.progression[progressionIdx].beats = localBeats;
    playerRef.progression[progressionIdx].chordInfo = localChordInfo;
    onComplete();
  }

  function cancelChanges() {
    onComplete();
  }

  function removeChord() {
    playerRef.progression.splice(progressionIdx, 1);
    onComplete();
  }

  $effect(() => {
    localBeats = playerRef.progression[progressionIdx].beats;
    localChordInfo = playerRef.progression[progressionIdx].chordInfo;
  });
</script>

<div class="popup-card">
  <div class="popup-header">
    <h2 class="text-heading-3">Edit Chord {progressionIdx + 1}</h2>
    <InteractiveElement
      color="surface"
      variant="text"
      shape="small"
      onclick={cancelChanges}
    >
      <Icon icon="close" />
    </InteractiveElement>
  </div>

  <div class="popup-body">
    <h1>{chordName}</h1>

    <div class="input-label space-above-large">
      <Label labelFor="duration">Duration</Label>
      <StepperInput
        id="duration"
        value={localBeats}
        onStepperClick={onStepperChangeDuration}
      />
    </div>

    <div class="remove-button-container">
      <Button color="destructive" variant="outline" onclick={removeChord}>
        <Icon icon="delete" />
        Remove
      </Button>
    </div>

    <h2 class="text-heading-3 space-above-large">Build Chord</h2>
    <div class="note-input-container space-above-small">
      <div class="input-label note-input">
        <Label labelFor="letter">Letter</Label>
        <Select
          id="letter"
          value={chordTonicLetter}
          options={naturalNoteNames}
          onchange={onChordLetterChange}
        />
      </div>
      <div class="input-label note-input">
        <Label labelFor="accidental">Acc</Label>
        <Select
          id="accidental"
          value={chordTonicAccidental}
          options={accidentalNames}
          onchange={onChordAccidentalChange}
        />
      </div>
      <div class="input-label">
        <Label labelFor="chord">Chord</Label>
        <Select
          id="chord"
          value={chordSymbol}
          options={simpleChordSymbols}
          onchange={onChordSymbolChange}
        />
      </div>
    </div>

    <h2 class="text-heading-3 space-above-large">Diatonic Chords</h2>
    <div class="diatonic-chords space-above-small">
      {#each diatonicChords as chordSet, i}
        <div class="chord-button-group">
          {#each chordSet.chords as chord, j}
            {@const chordName = chord.tonic + chord.symbol}
            <InteractiveElement
              color="surface"
              variant="outline"
              onclick={() => onDiatonicChordSelect(i, j)}
            >
              <div class="chord-button-container">
                <p class="text-caption-muted">{chordSet.degree}</p>
                <h3>{chordName}</h3>
              </div>
            </InteractiveElement>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <div class="popup-footer">
    <InteractiveElement
      color="surface"
      variant="outline"
      shape="large"
      onclick={cancelChanges}>Cancel</InteractiveElement
    >
    <InteractiveElement shape="large" onclick={applyChanges}
      >Apply</InteractiveElement
    >
  </div>
</div>

<style>
  .remove-button-container {
    display: flex;
    justify-content: end;

    margin-top: var(--space-16);
  }

  .input-label {
    display: grid;
    gap: var(--space-4);
  }

  .note-input-container {
    display: flex;
    gap: var(--space-8);

    padding: var(--space-8);

    border-radius: var(--space-8);
    background-color: var(--color-bg-surface-sunken);
  }
  .note-input-container > .input-label {
    flex: 1;
    max-width: 50px;
  }
  .note-input-container > .input-label:last-of-type {
    flex: 1;
    max-width: unset;
  }

  .diatonic-chords {
    display: grid;
    gap: var(--space-4);

    padding: var(--space-8);

    border-radius: var(--space-8);
    background-color: var(--color-bg-surface-sunken);
  }

  .chord-button-group {
    display: grid;
    grid-template-columns: repeat(3, minmax(min-content, 1fr));
    gap: var(--space-4);
  }

  .chord-button-container {
    display: flex;
    align-items: center;
    gap: var(--space-8);

    width: 100%;
    padding-block: var(--space-8);
  }

  @media (max-width: 320px) {
    .chord-button-group {
      grid-template-columns: repeat(2, minmax(min-content, 1fr));
    }
  }
</style>
