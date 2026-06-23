<script lang="ts">
  import "$lib/components/Popups/popup.css";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import InteractiveElement from "$lib/components/UI/Button.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Toggle from "$lib/components/UI/Toggle.svelte";
  import type { ProgressionPlayer } from "./chordProgressionPlayer.svelte";
  import Input from "$lib/components/UI/Input.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import { styleLibrary } from "./chordProgressionHelpers";
  import { keyNamesFlatted } from "$lib/helpers/musicTheoryConstants";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import Slider from "$lib/components/UI/Slider.svelte";

  type Props = {
    player: ProgressionPlayer;
    onComplete: () => void;
  };

  let { player, onComplete }: Props = $props();

  let autoVoicingToggled = $derived(player.autoMelodyChordInversions);
  let volumeValue = $derived(pianoAudioService.volumeValue);
  let bpmValue = $derived(player.bpm);
  let style = $derived(player.currentStyle);
  let key = $derived(player.globalKey);
  let autoTransposeToggled = $state(true);

  const styleIds = Object.values(styleLibrary).map((e) => e.id);
  const styleSelectOptions = Object.values(styleLibrary).map((e) => {
    return {
      value: e.id,
      label: e.name,
    };
  });

  function applyChanges() {
    player.autoMelodyChordInversions = autoVoicingToggled;

    // Piano audio service method does safety check on volume value arg
    if (volumeValue !== pianoAudioService.volumeValue) {
      pianoAudioService.changeVolume(volumeValue);
    }

    if (bpmValue < 40 || bpmValue > 240) bpmValue = 120;
    player.bpm = bpmValue;

    if (!styleIds.includes(style)) style = styleIds[0];
    player.currentStyle = style;

    if (key !== player.globalKey) {
      player.changeKey(key, autoTransposeToggled);
    }

    onComplete();
  }

  function cancelChanges() {
    onComplete();
  }
</script>

<div class="popup-card">
  <div class="popup-header">
    <h2 class="text-heading-3">Player Settings</h2>
    <InteractiveElement
      variant="text"
      size="icon-small"
      onclick={cancelChanges}
    >
      <Icon icon="close" />
    </InteractiveElement>
  </div>

  <div class="popup-body">
    <div class="slider-input-label lay-row">
      <Label labelFor="volume">Volume</Label>
      <span class="text-caption">{volumeValue}</span>
    </div>
    <div class="slider-input-container">
      <Slider id="volume" bind:value={volumeValue} min={0} max={100} />
    </div>

    <div class="lay-input-label-col space-above-base">
      <Label labelFor="beats-per-minute">BPM</Label>
      <Input
        id="beats-per-minute"
        bind:value={bpmValue}
        type="number"
        min="40"
        max="240"
      />
    </div>
    <div class="lay-input-label-col space-above-base">
      <Label labelFor="music-style">Style</Label>
      <Select
        id="music-style"
        bind:value={style}
        options={styleSelectOptions}
      />
    </div>
    <hr class="space-above-large" />
    <div class="key-select-container lay-input-label-col space-above-base">
      <Label labelFor="musical-key">Key</Label>
      <Select id="musical-key" bind:value={key} options={keyNamesFlatted} />
    </div>
    <div class="toggle-container lay-row space-above-large">
      <Label labelFor="auto-tranpose-toggle">Auto Tranpose</Label>
      <Toggle
        id="auto-transpose-toggle"
        bind:toggled={autoTransposeToggled}
        ariaLabel="Toggle Auto Transpose"
      />
    </div>
    <div class="toggle-container lay-row space-above-base">
      <Label labelFor="auto-voicing-toggle">Auto Voicing</Label>
      <Toggle
        id="auto-voicing-toggle"
        bind:toggled={autoVoicingToggled}
        ariaLabel="Toggle Auto Voicing"
      />
    </div>
  </div>

  <div class="popup-footer space-above-base">
    <InteractiveElement variant="secondary" onclick={cancelChanges}
      >Cancel</InteractiveElement
    >
    <InteractiveElement onclick={applyChanges}>Apply</InteractiveElement>
  </div>
</div>

<style>
  .lay-input-label-col {
    max-width: 15em;
  }
  .key-select-container {
    max-width: 5ch;
  }
  .toggle-container {
    justify-content: space-between;
    max-width: 9em;
  }

  .slider-input-container {
    max-width: 15em;
  }
</style>
