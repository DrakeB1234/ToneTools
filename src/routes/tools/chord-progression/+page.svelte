<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import PianoMiniRoll from "$lib/components/Piano/PianoMiniRoll.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import {
    getChord,
    getChordAbsoulteOctave,
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
  import { styleLibrary } from "./chordProgressionHelpers";
  import Popover from "$lib/components/UI/Popover.svelte";
  import Input from "$lib/components/UI/Input.svelte";
  import Slider from "$lib/components/UI/Slider.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import Toggle from "$lib/components/UI/Toggle.svelte";

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

    const foundChord = getChord(rawChord.tonic, rawChord.symbol);
    if (foundChord)
      player.progression.push({
        beats: 4,
        chordInfo: foundChord,
      });
  }

  onMount(() => {
    pianoAudioService.init();

    const startingProgression = [
      { chordInfo: getChordAbsoulteOctave("D", "m7"), beats: 4 },
      { chordInfo: getChordAbsoulteOctave("G", "7"), beats: 4 },
      { chordInfo: getChordAbsoulteOctave("C", "maj7"), beats: 4 },
      { chordInfo: getChordAbsoulteOctave("A", "7"), beats: 4 },
    ];
    const startStyleString = Object.keys(styleLibrary)[1];
    const startingStyle = styleLibrary[startStyleString].id;

    // Init progression with chords that MATCH key arg
    player.initPlayer(startingStyle, "C", startingProgression);
  });

  onDestroy(() => {
    player.stop();
    pianoAudioService.resetVolumeToDefault();
  });
</script>

<svelte:head>
  <title>Chord Progression | Music App</title>
</svelte:head>

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

    <Button
      variant="text"
      popovertarget="popover-target-bpm"
      aria-label="open popover for bpm settings"
    >
      <div class="lay-col lay-gap-4">
        <p class="text-caption">BPM</p>
        <p class="text-heading-3">120</p>
      </div>
    </Button>
    <Popover id="popover-target-bpm">
      <div>
        <p>BPM</p>
        <Input type="number" placeholder="BPM" />
      </div>
    </Popover>
    <Button
      variant="text"
      popovertarget="popover-target-volume"
      aria-label="open popover for volume settings"
    >
      <div class="lay-col lay-gap-4">
        <p class="text-caption">Volume</p>
        <p class="text-heading-3">70</p>
      </div>
    </Button>
    <Popover id="popover-target-volume">
      <div class="popover-volume-container">
        <p>Volume</p>
        <Slider value={70} min={0} max={100} ariaLabel="change volume" />
      </div>
    </Popover>
    <Button
      variant="text"
      popovertarget="popover-target-key-scale"
      aria-label="open popover for key and scale settings"
    >
      <div class="lay-col lay-gap-4">
        <p class="text-heading-3">C</p>
        <p class="text-caption">major</p>
      </div>
    </Button>
    <Popover id="popover-target-key-scale">
      <div>
        <p>Key</p>
        <Select options={["C"]} />
        <p class="space-above-small">Scale</p>
        <Select options={["Major"]} />
        <div class="lay-col space-above-base">
          <p>Transpose chords</p>
          <Toggle />
        </div>
      </div>
    </Popover>

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

  .popover-volume-container {
    min-width: 200px;
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
