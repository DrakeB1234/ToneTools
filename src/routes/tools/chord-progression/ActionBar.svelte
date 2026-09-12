<script lang="ts">
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PianoRoll from "$lib/components/Piano/PianoRoll.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Input from "$lib/components/UI/Input.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Popover from "$lib/components/UI/Popover.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import Slider from "$lib/components/UI/Slider.svelte";
  import Toggle from "$lib/components/UI/Toggle.svelte";
  import { getAllModes } from "$lib/helpers/musicTheory";
  import { keyNamesFlatted } from "$lib/helpers/musicTheoryConstants";
  import { styleLibrary } from "./chordProgressionHelpers";
  import type { ProgressionPlayer } from "./chordProgressionPlayer.svelte";

  type Props = {
    playerRef: ProgressionPlayer;
    currentScale: string;
  };

  let { playerRef, currentScale = $bindable() }: Props = $props();

  const styleSelectOptions = Object.values(styleLibrary).map((e) => {
    return {
      value: e.id,
      label: e.name,
    };
  });
  const styleIds = Object.values(styleLibrary).map((e) => e.id);

  let popoverStyleRef = $state<HTMLElement>();
  let popoverKeyRef = $state<HTMLElement>();
  let isPianoRollOpen = $state(false);

  // svelte-ignore state_referenced_locally
  let localData = $state({
    styleId: playerRef.currentStyleData.id,
    masterVolume: Howler.volume() * 100,
    volume: Howler.volume() * 100,
    bpmValue: playerRef.bpm,
    keyValue: playerRef.globalKey,
    scaleValue: currentScale,
    autoTransposeValue: true,
    autoVoicingValue: playerRef.autoMelodyChordInversions,
  });

  function handleVolumeChanged() {
    if (isNaN(localData.volume)) {
      localData.volume = 50;
      return;
    }
    const fixedValue = Math.max(0, Math.min(100, localData.volume));
    Howler.volume(fixedValue / 100);
    localData.masterVolume = fixedValue;
  }

  function handleAutoVoicingToggled() {
    localData.autoVoicingValue = !localData.autoVoicingValue;
    playerRef.autoMelodyChordInversions = localData.autoVoicingValue;
  }

  function handleBPMChanged() {
    let value = localData.bpmValue;
    if (value < 40 || value > 240) value = 120;
    playerRef.bpm = value;
  }

  function handlePopoverStyleApplyClick() {
    if (!styleIds.includes(localData.styleId)) return;

    playerRef.changeStyleById(localData.styleId);
    popoverStyleRef?.hidePopover();
  }

  function handleCancelStylePopoverClick() {
    if (!popoverStyleRef) return;
    popoverStyleRef.hidePopover();
  }

  function handlePopoverKeyApplyClick() {
    playerRef.changeKey(localData.keyValue, localData.autoTransposeValue);
    currentScale = localData.scaleValue;

    popoverKeyRef?.hidePopover();
  }

  function handleCancelKeyPopoverClick() {
    if (!popoverKeyRef) return;
    popoverKeyRef.hidePopover();
  }

  // Updates local values when popover opens
  function handlePopoverToggle(e: Event) {
    const toggleEvent = e as ToggleEvent;

    if (toggleEvent.newState === "open") {
      localData.styleId = playerRef.currentStyleData.id;
      localData.keyValue = playerRef.globalKey;
      localData.scaleValue = currentScale;
      localData.autoTransposeValue = true;
      localData.bpmValue = playerRef.bpm;
      localData.autoVoicingValue = playerRef.autoMelodyChordInversions;
    }
  }
</script>

<section class="action-bar flex-row scrollbar-custom">
  <div class="action-bar__button-container">
    <Button
      size="icon-base"
      circle
      onclick={playerRef.togglePlay}
      aria-label="Toggle chord progression playing"
    >
      <Icon icon={playerRef.isPlaying ? "stop" : "playArrow"} />
    </Button>
  </div>
  <div class="action-bar__button-container">
    <Button
      variant="secondary"
      size="icon-base"
      state={isPianoRollOpen ? "on" : "off"}
      circle
      onclick={() => (isPianoRollOpen = !isPianoRollOpen)}
      aria-label="Toggle show piano roll visualizer"
    >
      <Icon icon="piano" />
    </Button>
  </div>

  <Button
    variant="text"
    popovertarget="popover-volume"
    aria-label="Open change volume settings"
  >
    <div class="flex-col__input-label lay-gap-none">
      <p class="text-body-subtle">Volume</p>
      <p class="text-heading-3">{localData.masterVolume}</p>
    </div>
  </Button>
  <Popover id="popover-volume">
    <div class="grid-col lay-gap-base">
      <Label labelFor="input-volume">Volume {localData.volume}</Label>
      <Slider
        id="input-volume"
        min={0}
        max={100}
        bind:value={localData.volume}
        onchange={handleVolumeChanged}
      />
    </div>
  </Popover>

  <Button
    variant="text"
    popovertarget="popover-bpm"
    aria-label="Open change BPM settings"
  >
    <div
      class="action-bar__button-container flex-col__input-label lay-gap-none"
    >
      <p class="text-body-subtle">BPM</p>
      <p class="text-heading-3">{playerRef.bpm}</p>
    </div>
  </Button>
  <Popover id="popover-bpm" ontoggle={handlePopoverToggle}>
    <div class="flex-col__input-label">
      <Label labelFor="input-bpm">BPM</Label>
      <Input
        id="input-bpm"
        type="number"
        min="40"
        max="240"
        bind:value={localData.bpmValue}
        onchange={handleBPMChanged}
      />
    </div>
  </Popover>

  <Button
    variant="text"
    popovertarget="popover-key"
    aria-label="Open change key settings"
  >
    <div
      class="action-bar__button-container flex-col__input-label lay-gap-none"
    >
      <p class="text-body-subtle">Key</p>
      <p class="text-heading-3 text-truncate">{playerRef.globalKey}</p>
    </div>
  </Button>
  <Popover
    id="popover-key"
    bind:ref={popoverKeyRef}
    ontoggle={handlePopoverToggle}
  >
    <div>
      <div class="flex-col__input-label">
        <Label labelFor="input-key">Key</Label>
        <Select
          id="input-key"
          bind:value={localData.keyValue}
          options={keyNamesFlatted}
        />
      </div>
      <div class="flex-col__input-label space-above-sm">
        <Label labelFor="input-scale">Scale</Label>
        <Select
          id="input-scale"
          bind:value={localData.scaleValue}
          options={getAllModes()}
        />
      </div>
      <div class="flex-col__input-label space-above-sm">
        <Label labelFor="toggle-auto-transpose">Tranpose Chords</Label>
        <Toggle
          id="toggle-auto-transpose"
          bind:toggled={localData.autoTransposeValue}
        />
      </div>

      <div class="popover__bottom-buttons-container flex-row space-above-base">
        <Button
          variant="secondary"
          onclick={handleCancelKeyPopoverClick}
          aria-label="Cancel changes to music style">Cancel</Button
        >
        <Button
          onclick={handlePopoverKeyApplyClick}
          aria-label="Apply changes to music style">Apply</Button
        >
      </div>
    </div>
  </Popover>

  <Button
    variant="text"
    popovertarget="popover-style"
    aria-label="Open change music style settings"
  >
    <div
      class="action-bar__button-container flex-col__input-label lay-gap-none"
    >
      <p class="text-body-subtle">Style</p>
      <p class="text-heading-3 text-truncate">
        {playerRef.currentStyleData.name}
      </p>
    </div>
  </Button>
  <Popover
    id="popover-style"
    bind:ref={popoverStyleRef}
    ontoggle={handlePopoverToggle}
  >
    <div>
      <div class="flex-col__input-label">
        <Label labelFor="music-style">Music Style</Label>
        <Select
          id="music-style"
          bind:value={localData.styleId}
          options={styleSelectOptions}
        />
      </div>
      <div class="popover__bottom-buttons-container flex-row space-above-base">
        <Button
          variant="secondary"
          onclick={handleCancelStylePopoverClick}
          aria-label="Cancel changes to music style">Cancel</Button
        >
        <Button
          onclick={handlePopoverStyleApplyClick}
          aria-label="Apply changes to music style">Apply</Button
        >
      </div>
    </div>
  </Popover>

  <Button
    variant="text"
    popovertarget="popover-auto-voicing"
    aria-label="Open change auto voicing settings"
  >
    <div
      class="action-bar__button-container flex-col__input-label lay-gap-none"
    >
      <p class="text-body-subtle">Voicing</p>
      <p class="text-heading-3 text-truncate">
        {localData.autoVoicingValue ? "Auto" : "None"}
      </p>
    </div>
  </Button>
  <Popover id="popover-auto-voicing" ontoggle={handlePopoverToggle}>
    <div class="flex-col__input-label">
      <Label labelFor="input-auto-voicing">Auto Voicing</Label>
      <Toggle
        id="input-auto-voicing"
        toggled={localData.autoVoicingValue}
        onchange={handleAutoVoicingToggled}
      />
    </div>
  </Popover>
</section>

<div class="piano-roll-wrapper" class:hide={!isPianoRollOpen}>
  <section class="piano-roll">
    <PianoRoll
      activeNotes={playerRef.currentPlayedNotes}
      range={{
        startNote: "C1",
        endNote: "C7",
      }}
      labelMode="root"
      keyHeight={{ black: 44, white: 80 }}
      fit
    />
  </section>
</div>

<style>
  .action-bar {
    gap: var(--space-8);
    padding: var(--space-8) var(--space-12);
    overflow-x: auto;
  }
  .action-bar__button-container {
    max-width: 80px;
    flex-shrink: 0;
  }
  .popover__bottom-buttons-container {
    justify-content: end;
  }
  .piano-roll :global(.piano-svg) {
    min-height: 40px;
    max-width: unset;
  }
  .piano-roll {
    border-top: 1px solid var(--color-border);
    overflow-x: auto;
  }
  .hide {
    display: none;
  }
</style>
