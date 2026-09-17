<script lang="ts">
  import Icon from "$lib/components/Icons/Icon.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import { onMount } from "svelte";
  import "$lib/components/Modal/modal.css";
  import { stepNoteName } from "$lib/helpers/musicTheory";
  import type { NoteRange, StaffTypes } from "./helpers";
  import VSMusicStaff from "$lib/components/VSMusicStaff.svelte";
  import { MusicStaff } from "vector-score";

  type Props = {
    currentRange: NoteRange;
    currentStaffType: StaffTypes;
    currentStaffTypeNoteRange: NoteRange;
    onResponse: (confirmation: boolean, newRange?: NoteRange) => void;
  };
  let {
    currentRange,
    currentStaffType = $bindable(),
    currentStaffTypeNoteRange,
    onResponse,
  }: Props = $props();

  type StaffButtonPress =
    | "lowIncrement"
    | "lowDecrement"
    | "highIncrement"
    | "highDecrement";

  let musicStaffInstance: MusicStaff | null = $state(null);

  let lowRange: string = $derived(currentRange.low);
  let highRange: string = $derived(currentRange.high);

  function handleStaffButtonPressed(direction: StaffButtonPress) {
    if (
      direction === "lowDecrement" &&
      lowRange !== currentStaffTypeNoteRange.low
    ) {
      const newLowRange = stepNoteName(lowRange, -1);
      lowRange = newLowRange;
      updateLowStaffNote();
    } else if (
      direction === "lowIncrement" &&
      lowRange !== currentStaffTypeNoteRange.high
    ) {
      const newLowRange = stepNoteName(lowRange, 1);
      lowRange = newLowRange;
      updateLowStaffNote();
    } else if (
      direction === "highDecrement" &&
      highRange !== currentStaffTypeNoteRange.low
    ) {
      const newHighRange = stepNoteName(highRange, -1);
      highRange = newHighRange;
      updateHighStaffNote();
    } else if (
      direction === "highIncrement" &&
      highRange !== currentStaffTypeNoteRange.high
    ) {
      const newHighRange = stepNoteName(highRange, 1);
      highRange = newHighRange;
      updateHighStaffNote();
    }
  }

  function updateLowStaffNote() {
    if (!musicStaffInstance) return;
    musicStaffInstance.changeNoteByIndex(lowRange, 0);
  }

  function updateHighStaffNote() {
    if (!musicStaffInstance) return;
    musicStaffInstance.changeNoteByIndex(highRange, 1);
  }

  function handleConfirm() {
    onResponse(true, { low: lowRange, high: highRange });
  }

  onMount(() => {
    if (!musicStaffInstance) return;

    musicStaffInstance.drawNote([lowRange, highRange]);
    musicStaffInstance.justifyNotes();
  });
</script>

<div class="modal-card">
  <div class="modal-header">
    <h2 class="text-heading-3">Note Range</h2>
    <Button variant="text" size="icon-small" onclick={() => onResponse(false)}>
      <Icon icon="close" />
    </Button>
  </div>

  <div class="modal-body flex-row">
    <div class="staff-buttons flex-col lay-gap-base">
      <Button
        variant="outlined"
        size="icon-base"
        onclick={() => handleStaffButtonPressed("lowIncrement")}
        title="Increment Low Range"
      >
        <Icon icon="arrowUp" />
      </Button>
      <div class="flex-col lay-gap-xsm">
        <p>{lowRange}</p>
      </div>
      <Button
        variant="outlined"
        size="icon-base"
        onclick={() => handleStaffButtonPressed("lowDecrement")}
        title="Decrement Low Range"
      >
        <Icon icon="arrowDown" />
      </Button>
    </div>

    <div class="staff-container grid-center">
      <VSMusicStaff
        bind:instance={musicStaffInstance}
        options={{
          staffType: currentStaffType,
          scale: 1.3,
          width: 180,
          spaceAbove: 4,
          spaceBelow: 4,
        }}
      />
    </div>

    <div class="staff-buttons flex-col lay-gap-base">
      <Button
        variant="outlined"
        size="icon-base"
        onclick={() => handleStaffButtonPressed("highIncrement")}
        title="Increment High Range"
      >
        <Icon icon="arrowUp" />
      </Button>
      <div class="flex-col lay-gap-xsm">
        <p>{highRange}</p>
      </div>
      <Button
        variant="outlined"
        size="icon-base"
        onclick={() => handleStaffButtonPressed("highDecrement")}
        title="Decrement High Range"
      >
        <Icon icon="arrowDown" />
      </Button>
    </div>
  </div>

  <div class="modal-footer">
    <Button variant="outlined" onclick={() => onResponse(false)}>Cancel</Button>
    <Button onclick={handleConfirm}>Confirm</Button>
  </div>
</div>

<style>
  .staff-container {
    flex: 1;
    padding-inline: var(--space-16);
  }
  .staff-buttons {
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
</style>
