<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import PianoMiniRoll from "$lib/components/Piano/PianoMiniRoll.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Input from "$lib/components/UI/Input.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import {
    findChord,
    getDiatonicChordsFromScale,
  } from "$lib/helpers/musicTheory";
  import { onDestroy, onMount } from "svelte";
  import { ProgressionPlayer } from "./chordProgressionPlayer.svelte";
  import Toggle from "$lib/components/UI/Toggle.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import { keyNamesFlatted } from "$lib/helpers/musicTheoryConstants";
  import ChordTimelineItem from "./ChordTimelineItems.svelte";
  import Popup from "$lib/components/Popups/Popup.svelte";
  import EditChordPopup from "./EditChordPopup.svelte";
  import type { GeneralChord } from "$lib/helpers/musicTheoryTypes";

  const player = new ProgressionPlayer();

  let isEditChordPopupOpen: boolean = $state(false);
  // svelte-ignore non_reactive_update
  let chordToEditIdx = 0;

  let diatonicChords = $derived(
    getDiatonicChordsFromScale(player.globalKey, "major"),
  );

  function handleStyleSelectInput(
    e: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) {
    const value = e.currentTarget.value;
    if (!value) return;
    player.changeStyle(value);
  }

  function handleKeySelectInput(
    e: Event & { currentTarget: EventTarget & HTMLSelectElement },
  ) {
    const value = e.currentTarget.value;
    if (!value) return;
    player.changeKey(value);
  }

  function handleChordItemPressed(idx: number) {
    isEditChordPopupOpen = true;
    chordToEditIdx = idx;
  }

  function handleEditChordDone() {
    isEditChordPopupOpen = false;
  }

  function handleChordAddPressed() {
    let rawChord: Pick<GeneralChord, "tonic" | "symbol">;
    if (diatonicChords) rawChord = diatonicChords[0].chords[0];
    else rawChord = { tonic: "C", symbol: "M" };

    const foundChord = findChord(rawChord.tonic, rawChord.symbol);
    if (foundChord)
      player.progression.push({
        beats: 4,
        chordInfo: foundChord,
      });
  }

  onMount(() => {
    pianoAudioService.init();

    // Init progression with chords that MATCH key arg
    player.initProgression(
      [
        { chordInfo: findChord("D", "m7"), beats: 4 },
        { chordInfo: findChord("G", "7"), beats: 4 },
        { chordInfo: findChord("C", "maj7"), beats: 4 },
        { chordInfo: findChord("A", "7"), beats: 4 },
      ],
      "C",
    );

    player.changeStyle("bossa-nova");
  });

  onDestroy(() => {
    player.stop();
  });
</script>

<main>
  <PageHeaderContainer
    subText="Tools"
    headerText="Chord Progression"
    fallbackHref="/"
  />

  <section class="card">
    <div class="header-container">
      <h1 class="text-heading-2">Chord Progression Creator Mk9000</h1>
    </div>

    <div class="piano-roll-container">
      <hr />
      <PianoMiniRoll activeNotes={player.currentPlayedNotes} />
    </div>

    <div>
      <p>
        Melody Range:&nbsp;<span class="text-body-muted"
          >{player.noteRangeConfig.melody.min} / {player.noteRangeConfig.melody
            .max}</span
        >
      </p>
      <p>
        Bass Range:&nbsp;<span class="text-body-muted"
          >{player.noteRangeConfig.bass.min} / {player.noteRangeConfig.bass
            .max}</span
        >
      </p>
    </div>

    <div class="content-container">
      <div class="info-container">
        <div class="play-button-container">
          <Button size="icon-base" circle onclick={player.togglePlay}>
            <Icon icon={player.isPlaying ? "stop" : "playArrow"} />
          </Button>
        </div>
        <div class="lay-input-label-col">
          <Label labelFor="volume">Volume</Label>
          <Input
            id="volume"
            style="max-width: 8ch;"
            type="number"
            value="100"
            max="100"
            min="0"
          />
        </div>
        <div class="lay-input-label-col">
          <Label labelFor="tempo">Tempo</Label>
          <Input
            id="tempo"
            style="max-width: 8ch;"
            type="number"
            bind:value={player.bpm}
            max="240"
            min="40"
          />
        </div>
        <div class="lay-input-label-col">
          <Label labelFor="style">Style</Label>
          <Select
            id="style"
            onchange={handleStyleSelectInput}
            value={player.currentStyle}
            options={[
              { label: "Basic 1", value: "basic-1" },
              { label: "Basic 2", value: "basic-2" },
              { label: "Pop 1", value: "pop-1" },
              { label: "Bossa Nova", value: "bossa-nova" },
            ]}
          />
        </div>
        <div class="lay-input-label-col">
          <Label labelFor="key">Key</Label>
          <Select
            id="key"
            onchange={handleKeySelectInput}
            value={player.globalKey}
            options={keyNamesFlatted.map((e) => {
              return {
                label: e,
                value: e,
              };
            })}
          />
        </div>
      </div>

      <div class="space-above-large">
        <Label labelFor="autoVoicing">Auto Voicing</Label>
        <Toggle
          id="autoVoicing"
          bind:toggled={player.autoMelodyChordInversions}
          ariaLabel="Toggle Auto Voicing"
        />
      </div>

      <p class="space-above-large">Progression</p>
      <div class="space-above-xsmall">
        <ChordTimelineItem
          playerRef={player}
          onChordClick={handleChordItemPressed}
          onAddChordClick={handleChordAddPressed}
        />
      </div>
    </div>
  </section>
</main>

<Popup bind:isOpen={isEditChordPopupOpen}>
  <EditChordPopup
    progressionIdx={chordToEditIdx}
    playerRef={player}
    {diatonicChords}
    onComplete={handleEditChordDone}
  />
</Popup>

<style>
  main {
    display: grid;
    gap: var(--space-16);

    max-width: 1000px;
    padding: var(--space-8);
    padding-top: var(--space-16);
    margin: auto;
  }

  .card {
    padding: 0;

    overflow: hidden;
  }

  .header-container {
    padding: var(--space-16);

    background-color: var(--color-bg-primary);

    * {
      color: var(--color-on-bg-primary);
    }
  }

  .content-container {
    padding: var(--space-16);
  }

  .info-container {
    display: flex;
    align-items: center;
    gap: var(--space-8);

    padding: var(--space-8);

    overflow-x: auto;
    background-color: var(--color-bg-surface-2);
    border-radius: var(--radius-base);
  }

  .play-button-container {
    position: sticky;
    left: 0;
    flex-shrink: 0;

    padding: var(--space-12);
  }

  .piano-roll-container {
    overflow-x: auto;
    background-color: var(--color-bg-dark);
    padding-top: var(--space-12);
  }
  .piano-roll-container > hr {
    border-color: var(--color-bg-addon-red-contrast);
  }
</style>
