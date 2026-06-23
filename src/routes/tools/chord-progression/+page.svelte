<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import PianoMiniRoll from "$lib/components/Piano/PianoMiniRoll.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import {
    findChord,
    getDiatonicChordsFromScale,
  } from "$lib/helpers/musicTheory";
  import { onDestroy, onMount } from "svelte";
  import { ProgressionPlayer } from "./chordProgressionPlayer.svelte";
  import ChordTimelineItem from "./ChordTimelineItems.svelte";
  import Popup from "$lib/components/Popups/Popup.svelte";
  import EditChordPopup from "./EditChordPopup.svelte";
  import type { GeneralChord } from "$lib/helpers/musicTheoryTypes";
  import SummaryActionButton from "./SummaryActionButton.svelte";
  import EditPlayerSettingsPopup from "./EditPlayerSettingsPopup.svelte";

  const player = new ProgressionPlayer();

  let isPlayerSettingsPopupOpen: boolean = $state(false);
  let isEditChordPopupOpen: boolean = $state(false);
  // svelte-ignore non_reactive_update
  let chordToEditIdx = 0;

  let diatonicChords = $derived(
    getDiatonicChordsFromScale(player.globalKey, "major"),
  );

  function handlePlayerSettingsClick() {
    isPlayerSettingsPopupOpen = true;
  }
  function handlePlayerSettingsDone() {
    isPlayerSettingsPopupOpen = false;
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
    pianoAudioService.resetVolumeToDefault();
  });
</script>

<main>
  <PageHeaderContainer
    subText="Tools"
    headerText="Chord Progression"
    fallbackHref="/"
  />

  <section class="card">
    <header class="header-container">
      <h1 class="text-heading-2">Chord Progression Creator Mk9000</h1>
    </header>

    <section class="piano-roll-container">
      <hr />
      <PianoMiniRoll activeNotes={player.currentPlayedNotes} />
    </section>

    <section class="input-container card-high lay-row">
      <Button
        size="icon-base"
        circle
        onclick={player.togglePlay}
        aria-label="Toggle play chord progression"
      >
        <Icon icon={player.isPlaying ? "stop" : "playArrow"} />
      </Button>
      <SummaryActionButton {player} handleClick={handlePlayerSettingsClick} />
    </section>

    <section class="progression-timeline space-above-base">
      <p>Progression</p>
      <div class="space-above-xsmall">
        <ChordTimelineItem
          playerRef={player}
          onChordClick={handleChordItemPressed}
          onAddChordClick={handleChordAddPressed}
        />
      </div>
    </section>
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

<Popup bind:isOpen={isPlayerSettingsPopupOpen}>
  <EditPlayerSettingsPopup {player} onComplete={handlePlayerSettingsDone} />
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

  .input-container {
    flex-wrap: wrap;
    gap: var(--space-16);
    padding: var(--space-24) var(--space-16);
    border-radius: 0;
    border-width: 1px 0 1px 0;
  }

  .progression-timeline {
    padding: var(--space-16);
  }

  .piano-roll-container {
    overflow-x: auto;
    background-color: var(--color-bg-dark);
    padding-top: var(--space-12);
  }
  .piano-roll-container > hr {
    height: 2px;
    background-color: var(--color-bg-addon-red);
  }
</style>
