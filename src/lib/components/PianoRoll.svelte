<script lang="ts">
  let {
    visibleOctaves = 1,
    startingOctave = 4,
    activeNotes = [],
    showNoteNames = true,
  }: {
    visibleOctaves?: number;
    startingOctave?: number;
    activeNotes?: string[];
    showNoteNames?: boolean;
  } = $props();

  let activeNotesSet = $derived(new Set(activeNotes));

  const config = {
    white: { width: 44, height: 180, radius: 4 },
    black: { width: 28, height: 110, radius: 3 },
  };

  const baseOctave = [
    { name: "C", type: "white", whiteOffset: 0 },
    { name: "C#", type: "black", whiteOffset: 0 },
    { name: "D", type: "white", whiteOffset: 1 },
    { name: "D#", type: "black", whiteOffset: 1 },
    { name: "E", type: "white", whiteOffset: 2 },
    { name: "F", type: "white", whiteOffset: 3 },
    { name: "F#", type: "black", whiteOffset: 3 },
    { name: "G", type: "white", whiteOffset: 4 },
    { name: "G#", type: "black", whiteOffset: 4 },
    { name: "A", type: "white", whiteOffset: 5 },
    { name: "A#", type: "black", whiteOffset: 5 },
    { name: "B", type: "white", whiteOffset: 6 },
  ];

  let keys = $derived(
    Array.from({ length: visibleOctaves }).flatMap((_, octaveIndex) =>
      baseOctave.map((baseKey) => {
        const currentOctave = startingOctave + octaveIndex;

        const absoluteWhiteIndex = octaveIndex * 7 + baseKey.whiteOffset;
        let xPos = absoluteWhiteIndex * config.white.width;

        if (baseKey.type === "black") {
          xPos += config.white.width - config.black.width / 2;
        }

        const baseKeyType = config[baseKey.type as "white" | "black"];

        return {
          id: `${baseKey.name}${currentOctave}`,
          name: baseKey.name,
          type: baseKey.type,
          octave: currentOctave,
          x: xPos,
          width: baseKeyType.width,
          height: baseKeyType.height,
          radius: baseKeyType.radius,
        };
      }),
    ),
  );

  let whiteKeys = $derived(keys.filter((k) => k.type === "white"));
  let blackKeys = $derived(keys.filter((k) => k.type === "black"));

  let viewBoxWidth = $derived(visibleOctaves * 7 * config.white.width);
</script>

<div class="scroll-wrapper">
  <svg
    class="piano-svg"
    viewBox="0 0 {viewBoxWidth} {config.white.height}"
    role="img"
    aria-label="Piano Roll"
  >
    <g class="keys-layer">
      {#each whiteKeys as key (key.id)}
        {@const isActive = activeNotesSet.has(key.id)}
        <g class="key-group">
          <rect
            class="key white"
            class:active={isActive}
            x={key.x}
            y="0"
            width={key.width}
            height={key.height}
            rx={key.radius}
            data-note={key.name}
          />
          <text
            class="note-text white"
            class:hide={!showNoteNames}
            x={key.x + key.width / 2}
            y={key.height - 12}
          >
            {key.name}
          </text>
        </g>
      {/each}
    </g>

    <g class="keys-layer">
      {#each blackKeys as key (key.id)}
        {@const isActive = activeNotesSet.has(key.id)}
        <g class="key-group">
          <rect
            class="key black"
            class:active={isActive}
            x={key.x}
            y="0"
            width={key.width}
            height={key.height}
            rx={key.radius}
            data-note={key.name}
          />
          <text
            class="note-text black"
            class:hide={!showNoteNames}
            x={key.x + key.width / 2}
            y={26}
          >
            {key.name}
          </text>
        </g>
      {/each}
    </g>
  </svg>
</div>

<style>
  .scroll-wrapper {
    width: 100%;

    overflow-x: auto;
  }

  .piano-svg {
    max-width: unset;
    min-height: 9em;
    max-height: 12em;
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
    stroke-width: 2px;
  }

  .key.active ~ text {
    fill: var(--color-text-inverse, #ffffff);
  }

  .hide {
    display: none;
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
</style>
