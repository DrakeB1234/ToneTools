<script lang="ts">
  let {
    octaves = 1,
    activeNotes,
    showNoteNames = true,
    pianoClickCallBack,
  }: {
    octaves: number;
    activeNotes?: string[];
    showNoteNames?: boolean;
    pianoClickCallBack?: (note: string) => void;
  } = $props();

  const whiteWidth = 44;
  const whiteHeight = 180;
  const blackWidth = 26;
  const blackHeight = 110;

  const whiteNoteNameYPos = whiteHeight - 10;
  const whiteNoteNameXOffset = whiteWidth / 3;
  const blackNoteNameYPos = 24;
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
    Array.from({ length: octaves }).flatMap((_, i) =>
      baseOctave.map((k) => {
        const globalWIdx = i * 7 + k.wIdx;

        const x =
          k.type === "white"
            ? globalWIdx * whiteWidth
            : globalWIdx * whiteWidth + whiteWidth - blackWidth / 2;

        return {
          ...k,
          note: k.note,
          octave: i + 1,
          x,
          width: k.type === "white" ? whiteWidth : blackWidth,
          height: k.type === "white" ? whiteHeight : blackHeight,
        };
      }),
    ),
  );

  let whiteKeys = $derived(keys.filter((k) => k.type === "white"));
  let blackKeys = $derived(keys.filter((k) => k.type === "black"));

  let viewBoxWidth = $derived(octaves * 7 * whiteWidth);

  function handlePianoClick(e: PointerEvent) {
    const target = e.target as SVGElement;
    const note = target.dataset.note;

    if (!note) return;
    if (pianoClickCallBack) pianoClickCallBack(note);
  }
</script>

<svg
  class="piano-svg"
  viewBox="0 0 {viewBoxWidth} {whiteHeight}"
  preserveAspectRatio="xMidYMid meet"
  onpointerdown={handlePianoClick}
  role="img"
  aria-label="Piano Roll"
>
  <g class="white-keys">
    {#each whiteKeys as key (`${key.note}${key.octave}`)}
      <rect
        class="key white"
        class:active={activeNotes?.includes(key.note + key.octave)}
        x={key.x}
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
        x={key.x + whiteNoteNameXOffset}>{key.note}</text
      >
    {/each}
  </g>

  <g class="black-keys">
    {#each blackKeys as key (`${key.note}${key.octave}`)}
      <rect
        class="key black"
        class:active={activeNotes?.includes(key.note + key.octave)}
        x={key.x}
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
        x={key.x + blackNoteNameXOffset}>{key.note}</text
      >
    {/each}
  </g>
</svg>

<style>
  .piano-svg {
    width: 100%;
  }

  .key {
    cursor: pointer;
    transition: fill 0.15s ease;
  }
  .key.white {
    fill: var(--color-bg-surface, #ffffff);
    stroke: var(--color-border, #ccc);
    stroke-width: 1px;
  }
  .key.white:hover {
    fill: var(--color-hover-surface, #f0f0f0);
  }
  .key.black {
    fill: var(--palette-black, #111111);
  }
  .key.black:hover {
    fill: #333333;
  }
  .key.active {
    fill: var(--color-bg-primary);
    stroke: var(--color-border-primary);
    stroke-width: 2;
  }
  .key.active + text {
    fill: var(--color-text-inverse);
  }
  .key.active:hover {
    fill: var(--color-hover-primary);
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
