<script lang="ts">
  import { MusicStaff, type MusicStaffOptions } from "vector-score";

  type Props = {
    options?: MusicStaffOptions;
    instance?: MusicStaff | null;
  };

  let { options, instance = $bindable(null) }: Props = $props();

  function setupVectorScore(node: HTMLDivElement) {
    const defaultOptions: MusicStaffOptions = {
      staffType: "grand",
      staffColor: "var(--color-on-bg-surface)",
      staffBackgroundColor: "var(--color-bg-surface-1)",
      width: 300,
      noteStartX: 0,
      scale: 1,
      spaceAbove: 2,
      spaceBelow: 2,
      keySignature: undefined,
      ...options,
    };

    instance = new MusicStaff(node, defaultOptions);

    return {
      destroy() {
        instance = null;
      },
    };
  }
</script>

<div use:setupVectorScore></div>
