<script lang="ts">
  import { convertNoteNameToMidi } from "$lib/helpers/musicTheory";
  import {
    keysConfig,
    getActiveMidiNums,
    getViewBoxWidth,
    generateKeys,
    viewBoxHeight,
  } from "../../helpers/pianoHelpers";

  let {
    activeNotes = [],
    range = {
      startNote: "C4",
      endNote: "E6",
    },
  }: {
    activeNotes?: string[];
    range?: {
      startNote: string;
      endNote: string;
    };
  } = $props();

  let startMidiNum = $derived(convertNoteNameToMidi(range.startNote) ?? 60);
  let endMidiNum = $derived(convertNoteNameToMidi(range.endNote) ?? 84);

  let keys = $derived(generateKeys(startMidiNum, endMidiNum));

  let whiteKeys = $derived(keys.filter((k) => k.type === "white"));
  let blackKeys = $derived(keys.filter((k) => k.type === "black"));

  let viewBoxWidth = $derived(getViewBoxWidth(whiteKeys.length));

  let activeMidis = $derived(getActiveMidiNums(activeNotes));
</script>

<svg
  class="piano-svg"
  role="img"
  aria-label="Piano Roll"
  viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
>
  <g class="keys-layer">
    {#each whiteKeys as key (key.midi)}
      {@const isActive = activeMidis.has(key.midi)}
      <g class="key-group">
        <rect
          class="key white"
          class:active={isActive}
          x={key.x}
          y="0"
          width={keysConfig.white.width}
          height={keysConfig.white.height}
          rx={keysConfig.white.radius}
          data-note={key.midi}
        />
        <text
          class="note-text white"
          x={key.x + keysConfig.white.width / 2}
          y={keysConfig.white.height - 12}
        >
          {key.noteName}
        </text>
      </g>
    {/each}
  </g>

  <g class="keys-layer">
    {#each blackKeys as key (key.midi)}
      {@const isActive = activeMidis.has(key.midi)}
      <g class="key-group">
        <rect
          class="key black"
          class:active={isActive}
          x={key.x}
          y="0"
          width={keysConfig.black.width}
          height={keysConfig.black.height}
          rx={keysConfig.black.radius}
          data-note={key.midi}
        />
        <text
          class="note-text black"
          x={key.x + keysConfig.black.width / 2}
          y={26}
        >
          {key.enharmonicNoteName}
        </text>
        <text
          class="note-text black"
          x={key.x + keysConfig.black.width / 2}
          y={42}
        >
          {key.noteName}
        </text>
      </g>
    {/each}
  </g>
</svg>

<style>
  .piano-svg {
    max-width: unset;
    min-height: 6em;
    max-height: 11em;

    overflow: visible;
  }

  .key.white {
    fill: var(--color-bg-surface, #ffffff);
    stroke: var(--color-border, #ccc);
  }

  .key.black {
    fill: var(--palette-black, #111111);
  }

  .note-text {
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-base);
    pointer-events: none;
    text-anchor: middle;
  }

  .note-text.white {
    fill: var(--color-text);
  }

  .note-text.black {
    fill: var(--color-text-inverse, #ffffff);
  }

  /* TEMP WORKAROUND translateX to see active border over the inactive keys */
  .key.active {
    fill: var(--color-bg-brand);
    stroke: var(--color-border-brand);

    transform: translatex(-1px);
  }

  .key.active ~ text {
    fill: var(--color-text-inverse, #ffffff);
  }
</style>
