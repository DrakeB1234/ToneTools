<script lang="ts">
  import { GuitarChord, type GuitarChordOptions } from "vector-score";

  type Props = {
    options?: GuitarChordOptions;
    instance?: GuitarChord | null;
  };

  let { options, instance = $bindable(null) }: Props = $props();

  function setupVectorScore(node: HTMLDivElement) {
    // This is used to determine the options for GuitarChord class ON COMPONENT MOUNT
    // Will not recalculate this value on resize (reduce event listeners)
    const viewportWidth = window.innerWidth;
    const inlineChordsAmount = viewportWidth > 700 ? 4 : 2;

    const defaultOptions: GuitarChordOptions = {
      stringLabels: ["E", "A", "D", "G", "B", "E"],
      inlineChordsAmount: inlineChordsAmount,
      scale: 1,
      fretCount: 5,
      stringCount: 6,
      color: "var(--color-on-bg-surface)",
      backgroundColor: "var(--color-bg-surface-1)",
      ...options,
    };

    instance = new GuitarChord(node, defaultOptions);

    return {
      destroy() {
        instance = null;
      },
    };
  }
</script>

<div use:setupVectorScore></div>
