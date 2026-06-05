<script lang="ts">
  import { convertNoteNameToMidi } from "$lib/helpers/musicTheory";
  import {
    keysConfig,
    getActiveMidiNums,
    getViewBoxWidth,
    generateKeys,
    viewBoxHeight,
  } from "../../helpers/pianoHelpers";
  import "./piano.css";

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
