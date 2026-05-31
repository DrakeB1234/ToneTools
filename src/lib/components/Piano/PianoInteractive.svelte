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
    onNoteClick,
  }: {
    activeNotes?: string[];
    range?: {
      startNote: string;
      endNote: string;
    };
    onNoteClick?: (midi: number) => void;
  } = $props();

  let startMidiNum = $derived(convertNoteNameToMidi(range.startNote) ?? 60);
  let endMidiNum = $derived(convertNoteNameToMidi(range.endNote) ?? 84);

  let keys = $derived(generateKeys(startMidiNum, endMidiNum));

  let whiteKeys = $derived(keys.filter((k) => k.type === "white"));
  let blackKeys = $derived(keys.filter((k) => k.type === "black"));

  let viewBoxWidth = $derived(getViewBoxWidth(whiteKeys.length));

  let activeMidis = $derived(getActiveMidiNums(activeNotes));

  function handleSvgInteraction(e: MouseEvent | KeyboardEvent) {
    const target = e.target as Element;

    const keyElement = target.closest("[data-midinum]");

    if (keyElement) {
      const midiString = keyElement.getAttribute("data-midinum");
      if (midiString) {
        onNoteClick?.(Number(midiString));
      }
    }
  }
</script>

<div class="scroll-wrapper hide-scrollbar">
  <div class="piano-content-wrapper">
    <div class="control-track">
      <div class="dummy-ruler-line"></div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <svg
      class="piano-svg"
      aria-label="Piano Roll"
      viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
      onclick={handleSvgInteraction}
      role="img"
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
              data-midinum={key.midi}
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
              data-midinum={key.midi}
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
  </div>
</div>

<style>
  .scroll-wrapper {
    width: 100%;

    overflow-x: auto;

    border: 1px solid var(--color-border, #ccc);
    border-bottom: none;
    border-radius: var(--radius-8) var(--radius-8) 0 0;
  }

  .piano-content-wrapper {
    display: inline-flex;
    flex-direction: column;
  }

  .control-track {
    width: 100%;
    height: 2em;
    position: relative;
    background-color: var(--color-bg-app-sunken);
  }

  .dummy-ruler-line {
    width: 100%;
    height: 50%;
    border-bottom: 1px dashed var(--color-border-dark);
  }

  .piano-svg {
    height: 11em;
    max-width: unset;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .key.white {
    fill: var(--color-bg-surface);
    stroke: var(--color-border);
  }
  .key.white:hover:not(.active) {
    fill: var(--color-surface-hover);
  }

  .key.black {
    fill: var(--palette-black);
  }
  .key.black:hover:not(.active) {
    fill: var(--palette-grey-700);
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
    fill: var(--color-text-inverse);
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
