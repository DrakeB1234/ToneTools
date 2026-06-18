<script lang="ts">
  import Icon from "$lib/components/Icons/Icon.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import type { ProgressionPlayer } from "./chordProgressionPlayer.svelte";

  let {
    playerRef,
    onChordClick,
    onAddChordClick,
  }: {
    playerRef: ProgressionPlayer;
    onChordClick: (idx: number) => void;
    onAddChordClick: () => void;
  } = $props();
</script>

<div class="chord-progression-container">
  {#each playerRef.progression as progressionObj, i (i)}
    <div
      class="grid-cell-wrapper"
      style="grid-column: span {progressionObj.beats || 4};"
    >
      <InteractiveElement
        color="surface"
        variant="outline"
        element="button"
        activeStyle="active-style-2"
        active={playerRef.isPlaying && playerRef.currentProgressionIdx === i}
        onclick={() => onChordClick(i)}
      >
        <div class="chord-progression-item">
          <div class="chord-progression-text">
            <p class="text-heading-2">
              {progressionObj.chordInfo?.tonic ?? ""}{progressionObj.chordInfo
                ?.symbol ?? ""}
            </p>
          </div>

          <div class="beat-markers">
            {#each Array(Math.max(0, (progressionObj.beats || 4) - 1)) as _}
              <span class="marker-line"></span>
            {/each}
          </div>
        </div>
      </InteractiveElement>
    </div>
  {/each}
  <div class="grid-cell-wrapper add-cell">
    <InteractiveElement
      element="button"
      variant="outline"
      onclick={onAddChordClick}
    >
      <div class="add-cell-icon">
        <Icon icon="plus" />
      </div>
    </InteractiveElement>
  </div>
</div>

<style>
  .grid-cell-wrapper {
    display: flex;
    min-width: 0;
    width: 100%;
  }

  :global(.grid-cell-wrapper > *) {
    width: 100%;
  }

  .chord-progression-container {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    gap: var(--space-8);

    padding: var(--space-8);
    background-color: var(--color-bg-surface-dark);
    border-radius: var(--radius-8);
  }

  .chord-progression-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 70px;
  }

  .chord-progression-text {
    padding-inline: var(--space-8);
    margin-block: auto;
    overflow: hidden;
  }
  .chord-progression-text > p {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .beat-markers {
    display: flex;
    justify-content: space-evenly;
    align-items: end;
    width: 100%;
  }

  .marker-line {
    width: 2px;
    height: 12px;
    background-color: var(--color-border);
  }

  .add-cell {
    grid-column: span 1;
    min-height: 70px;
  }

  .add-cell-icon {
    display: grid;
    place-items: center;
    width: 100%;
  }

  @media (max-width: 600px) {
    .chord-progression-container {
      grid-template-columns: repeat(8, 1fr);
    }
  }
</style>
