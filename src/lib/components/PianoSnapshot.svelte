<script lang="ts">
  import {
    convertMidiToNoteName,
    convertNoteNameToMidi,
    getEnharmonicNote,
  } from "$lib/helpers/musicTheory";

  let {
    activeNotes = [],
    range = {
      start: "C4",
      end: "E6",
    },
  }: {
    activeNotes?: string[];
    range?: {
      start: string;
      end: string;
    };
  } = $props();

  const keysConfig = {
    white: { width: 42, height: 180, radius: 0 },
    black: { width: 26, height: 106, radius: 4 },
  };
  const viewBoxPadding = 2;

  const blackKeysSet = new Set([1, 3, 6, 8, 10]);

  let startMidi = $derived(convertNoteNameToMidi(range.start) ?? 60);
  let endMidi = $derived(convertNoteNameToMidi(range.end) ?? 84);

  let activeMidis = $derived.by(() => {
    let midis = new Set<number>();
    for (const note of activeNotes) {
      const midi = convertNoteNameToMidi(note);
      if (midi) midis.add(midi);
    }
    return midis;
  });

  let keys = $derived(generateKeys());

  let whiteKeys = $derived(keys.filter((k) => k.type === "white"));
  let blackKeys = $derived(keys.filter((k) => k.type === "black"));

  let viewBoxWidth = $derived(
    whiteKeys.length * keysConfig.white.width + viewBoxPadding,
  );
  let viewBoxHeight = keysConfig.white.height;

  // Functions
  type KeyObj = {
    midi: number;
    noteName: string;
    enharmonicNoteName: string;
    type: "white" | "black";
    x: number;
  };

  function generateKeys(): KeyObj[] {
    let keys: KeyObj[] = [];

    const isFirstKeyBlack = blackKeysSet.has(startMidi % 12);
    let currentXPos = isFirstKeyBlack ? keysConfig.black.width / 2 : 0;

    const totalKeys = endMidi - startMidi + 1;

    for (let i = 0; i < totalKeys; i++) {
      const midi = startMidi + i;
      const noteName = convertMidiToNoteName(midi);
      const chroma = midi % 12;
      const isBlack = blackKeysSet.has(chroma);
      const type = isBlack ? "black" : "white";

      let xPos = currentXPos;

      if (isBlack) {
        xPos -= keysConfig.black.width / 2;
      } else {
        xPos = currentXPos;
        currentXPos += keysConfig.white.width;
      }

      const noteNameWithoutOctave = noteName.slice(0, -1);
      const enharmonicNoteName = getEnharmonicNote(noteNameWithoutOctave);

      keys.push({
        midi,
        noteName: noteNameWithoutOctave,
        enharmonicNoteName,
        type,
        x: xPos,
      });
    }

    return keys;
  }
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

  /* Added Active States */
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
