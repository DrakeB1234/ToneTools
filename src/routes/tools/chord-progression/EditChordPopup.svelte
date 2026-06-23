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
      variant="text"
      size="icon-small"
      onclick={cancelChanges}
    >
      <Icon icon="close" />
    </InteractiveElement>
  </div>

  <div class="popup-body">
    <p class="text-caption-muted">Current Chord</p>
    <h2 class="text-heading-1">{chordName}</h2>

    <div class="lay-input-label-col space-above-base">
      <Label id="duration">Duration</Label>
      <StepperInput
        id="duration"
        value={localBeats}
        onStepperClick={onStepperChangeDuration}
      />
    </div>

    <Button
      variant="destructive-outlined"
      size="small"
      class="space-above-xlarge"
      onclick={removeChord}
    >
      <Icon icon="delete" />
      Remove Chord
    </Button>

    <hr class="space-above-large" />

    <h2 class="text-heading-3 space-above-large">Build Chord</h2>
    <div class="lay-row space-above-small">
      <div class="note-input lay-input-label-col">
        <Label labelFor="letter">Letter</Label>
        <Select
          id="letter"
          value={chordTonicLetter}
          options={naturalNoteNames}
          onchange={onChordLetterChange}
        />
      </div>
      <div class="note-input lay-input-label-col">
        <Label labelFor="accidental">Acc</Label>
        <Select
          id="accidental"
          value={chordTonicAccidental}
          options={accidentalNames}
          onchange={onChordAccidentalChange}
        />
      </div>
      <div class="chord-input lay-input-label-col">
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
    <div class="lay-col space-above-small">
      {#each diatonicChords as chordSet, i}
        <div class="chord-button-group">
          {#each chordSet.chords as chord, j}
            {@const chordName = chord.tonic + chord.symbol}
            <InteractiveElement
              variant="outlined"
              fullWidth
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
    <InteractiveElement variant="secondary" onclick={cancelChanges}
      >Cancel</InteractiveElement
    >
    <InteractiveElement onclick={applyChanges}>Apply</InteractiveElement>
  </div>
</div>

<style>
  .note-input {
    min-width: 4.5ch;
  }

  .chord-input {
    width: 100%;
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
