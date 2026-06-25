<script lang="ts">
  import "$lib/components/Popups/popup.css";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import InteractiveElement from "$lib/components/UI/Button.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import StepperInput from "$lib/components/UI/StepperInput.svelte";
  import {
    getAccidentalFromNoteName,
    getLetterFromNoteName,
    getChordAbsoulteOctave,
  } from "$lib/helpers/musicTheory";
  import {
    accidentalNames,
    naturalNoteNames,
    simpleChordSymbols,
  } from "$lib/helpers/musicTheoryConstants";
  import type { DiatonicChordSet } from "$lib/helpers/musicTheoryTypes";
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

  // svelte-ignore state_referenced_locally
  const initialChordInfo = playerRef.progression[progressionIdx].chordInfo;
  // svelte-ignore state_referenced_locally
  let localBeats = $state(playerRef.progression[progressionIdx].beats);

  let chordTonicLetter = $state(
    initialChordInfo ? getLetterFromNoteName(initialChordInfo.tonic) : "C",
  );
  let chordTonicAccidental = $state(
    initialChordInfo ? getAccidentalFromNoteName(initialChordInfo.tonic) : "n",
  );
  let chordSymbol = $state(initialChordInfo ? initialChordInfo.symbol : "maj");

  let previewChordName = $derived(
    `${chordTonicLetter}${chordTonicAccidental === "n" ? "" : chordTonicAccidental}${chordSymbol}`,
  );

  function onStepperChangeDuration(direction: number) {
    let newValue = localBeats + direction;
    if (newValue < 1 || newValue > 8) return;
    localBeats = newValue; // Mutate local state directly
  }

  function onDiatonicChordSelect(degree: number, chordIdx: number) {
    const selectedChord = diatonicChords![degree].chords[chordIdx];

    // Mutate local state directly
    chordTonicLetter = getLetterFromNoteName(selectedChord.tonic);
    chordTonicAccidental = getAccidentalFromNoteName(selectedChord.tonic);
    chordSymbol = selectedChord.symbol;
  }

  function applyChanges() {
    const fixedAccidental =
      chordTonicAccidental !== "n" ? chordTonicAccidental : "";
    const chordObj = getChordAbsoulteOctave(
      chordTonicLetter + fixedAccidental,
      chordSymbol,
    );
    if (!chordObj) return null;
    if (localBeats < 1 || localBeats > 8) localBeats = 4;

    playerRef.progression[progressionIdx] = {
      chordInfo: chordObj,
      beats: localBeats,
    };

    onComplete();
  }

  function cancelChanges() {
    onComplete();
  }

  function removeChord() {
    playerRef.progression.splice(progressionIdx, 1);
    onComplete();
  }
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
    <section class="header-container lay-row">
      <div>
        <p class="text-caption-muted">Current Chord</p>
        <h2 class="text-heading-1">{previewChordName}</h2>
      </div>
      <Button
        onclick={() =>
          playerRef.forcePlayMelodyAtProgressionIdx(progressionIdx)}
        size="icon-small"
      >
        <Icon icon="volumeUp" />
      </Button>
    </section>

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
          bind:value={chordTonicLetter}
          options={naturalNoteNames}
        />
      </div>
      <div class="note-input lay-input-label-col">
        <Label labelFor="accidental">Acc</Label>
        <Select
          id="accidental"
          bind:value={chordTonicAccidental}
          options={accidentalNames}
        />
      </div>
      <div class="chord-input lay-input-label-col">
        <Label labelFor="chord">Chord</Label>
        <Select
          id="chord"
          bind:value={chordSymbol}
          options={simpleChordSymbols}
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
  section.header-container {
    justify-content: space-between;
  }

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
