<script lang="ts">
  import { getEnharmonicNote } from "$lib/helpers/musicTheory";

  let {
    visibleOctaves = 1,
    startingOctave = 4,
    activeNotes = [],
    showNoteNames = true,
  }: {
    visibleOctaves: number;
    startingOctave: number;
    activeNotes?: string[];
    showNoteNames?: boolean;
  } = $props();

  const whiteWidth = 44;
  const whiteHeight = 180;
  const blackWidth = 26;
  const blackHeight = 110;

  const whiteNoteNameYPos = whiteHeight - 10;
  const whiteNoteNameXOffset = whiteWidth / 3;
  const blackNoteNameYPos = 24;
  const blackNoteEnharmonicNoteNameYPos = blackNoteNameYPos + 22;
  const blackNoteNameXOffset = blackWidth / 6;

  const baseOctave = [
    { note: "C", type: "white", wIdx: 0 },
    { note: "C#", type: "black", wIdx: 0 },
    { note: "D", type: "white", wIdx: 1 },
    { note: "D#", type: "black", wIdx: 1 },
    { note: "E", type: "white", wIdx: 2 },
    { note: "F", type: "white", wIdx: 3 },
    { note: "F#", type: "black", wIdx: 3 },
    { note: "G", type: "white", wIdx: 4 },
    { note: "G#", type: "black", wIdx: 4 },
    { note: "A", type: "white", wIdx: 5 },
    { note: "A#", type: "black", wIdx: 5 },
    { note: "B", type: "white", wIdx: 6 },
  ];

  let keys = $derived(
    Array.from({ length: visibleOctaves }).flatMap((_, i) =>
      baseOctave.map((e) => {
        const globalWIdx = i * 7 + e.wIdx;

        const xPos =
          e.type === "white"
            ? globalWIdx * whiteWidth
            : globalWIdx * whiteWidth + whiteWidth - blackWidth / 2;

        return {
          ...e,
          note: e.note,
          octave: startingOctave + i,
          xPos,
          width: e.type === "white" ? whiteWidth : blackWidth,
          height: e.type === "white" ? whiteHeight : blackHeight,
        };
      }),
    ),
  );

  let whiteKeys = $derived(keys.filter((e) => e.type === "white"));
  let blackKeys = $derived(keys.filter((e) => e.type === "black"));

  let viewBoxWidth = $derived(visibleOctaves * 7 * whiteWidth);
</script>

<svg
  class="piano-svg"
  viewBox="0 0 {viewBoxWidth} {whiteHeight}"
  role="img"
  aria-label="Piano Roll"
>
  <g class="white-keys">
    {#each whiteKeys as key (`${key.note}${key.octave}`)}
      <rect
        class="key white"
        class:active={activeNotes?.includes(key.note + key.octave)}
        x={key.xPos}
        y="0"
        width={key.width}
        height={key.height}
        data-note={key.note}
        data-octave={key.octave}
        rx="4"
      />
      <text
        class="note-text white"
        class:hide={!showNoteNames}
        y={whiteNoteNameYPos}
        x={key.xPos + whiteNoteNameXOffset}>{key.note}</text
      >
    {/each}
  </g>

  <g class="black-keys">
    {#each blackKeys as key (`${key.note}${key.octave}`)}
      <rect
        class="key black"
        class:active={activeNotes?.includes(key.note + key.octave)}
        x={key.xPos}
        y="0"
        width={key.width}
        height={key.height}
        data-note={key.note}
        data-octave={key.octave}
        rx="3"
      />
      <text
        class="note-text black"
        class:hide={!showNoteNames}
        y={blackNoteNameYPos}
        x={key.xPos + blackNoteNameXOffset}>{key.note}</text
      >
      <text
        class="note-text black"
        class:hide={!showNoteNames}
        y={blackNoteEnharmonicNoteNameYPos}
        x={key.xPos + blackNoteNameXOffset}
        >{getEnharmonicNote(key.note, true)}</text
      >
    {/each}
  </g>
</svg>

<style>
  .piano-svg {
    max-height: 11em;
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--radius-8);
  }

  .key.white {
    fill: var(--color-bg-surface, #ffffff);
    stroke: var(--color-border, #ccc);
    stroke-width: 1px;
  }
  .key.black {
    fill: var(--palette-black, #111111);
  }
  .key.active {
    fill: var(--color-bg-brand);
    stroke: var(--color-border-brand);
    stroke-width: 2;
  }
  .key.active + text {
    fill: var(--color-text-inverse);
  }

  .note-text {
    pointer-events: none;
  }
  .note-text.hide {
    display: none;
  }
  .note-text.white {
    fill: var(--color-text);
    font-size: var(--font-size-base);
  }
  .note-text.black {
    fill: var(--color-text-inverse);
    font-size: var(--font-size-sm);
  }
</style>
