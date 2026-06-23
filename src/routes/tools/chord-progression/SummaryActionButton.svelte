<script lang="ts">
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import type { ProgressionPlayer } from "./chordProgressionPlayer.svelte";

  type Props = {
    player: ProgressionPlayer;
    handleClick: () => void;
  };

  let { player, handleClick }: Props = $props();

  let displayedValues = $derived({
    volume: pianoAudioService.volumeValue,
    bpmValue: player.bpm,
    styleName: player.currentStyleData.name,
  });
</script>

<Button
  variant="outlined"
  overrideHoverOnColor="surface-2"
  aria-label="Open Audio Player Settings"
  onclick={handleClick}
>
  <div class="button-content lay-row">
    <div class="lay-col">
      <p class="text-caption">Volume</p>
      <p class="text-heading-3">{displayedValues.volume}</p>
    </div>
    <div class="lay-col">
      <p class="text-caption">BPM</p>
      <p class="text-heading-3">{displayedValues.bpmValue}</p>
    </div>
    <div class="lay-col">
      <p class="text-caption">Style</p>
      <p class="text-heading-3">{displayedValues.styleName}</p>
    </div>
    <div>
      <Icon icon="instantMix" />
    </div>
  </div>
</Button>

<style>
  .button-content {
    gap: var(--space-16);
  }
  .lay-col {
    flex: 1;
    gap: 0;
  }
  p {
    text-wrap: nowrap;
  }
</style>
