<script lang="ts">
  import ExerciseLayout from "$lib/components/Exercises/ExerciseLayout.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import { onMount } from "svelte";
  import { StaffTypeSpacing, type ConfigOptions } from "./helpers";
  import { Controller } from "./Controller.svelte";
  import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
  import { midiService } from "$lib/midiservice/midiService.svelte";
  import MidiDeviceConnect from "$lib/components/MidiDeviceConnect.svelte";
  import VSMusicStaff from "$lib/components/VSMusicStaff.svelte";
  import { MusicStaff } from "vector-score";
  import NoteInput from "$lib/components/UI/NoteInput.svelte";
  import NoteKeyboard from "$lib/components/UI/NoteKeyboard.svelte";

  type Props = {
    config: ConfigOptions;
    handleExit: () => void;
  };

  let { config, handleExit }: Props = $props();

  // svelte-ignore state_referenced_locally
  const staffSpacingObj = StaffTypeSpacing[config.clef];
  let musicStaffInstance: MusicStaff | null = $state(null);

  // svelte-ignore state_referenced_locally
  const controller = new Controller(config);

  function handleExitPressed() {
    handleExit();
  }

  function handleInput(note: string) {
    const fullNote = note;
    controller.handleInput(fullNote);
  }

  onMount(() => {
    if (musicStaffInstance) controller.addVSStaffInstancee(musicStaffInstance);

    const unsubscribe = midiService.subscribe((msg) => {
      if (msg.type === "noteOn" && msg.notes.length > 0) {
        controller.handleMidiInput(msg.notes[0]);
      }
    });

    return () => {
      unsubscribe();
      controller.destroy();
      Howler.stop();
    };
  });
</script>

<main>
  <ExerciseLayout
    handleExitClick={handleExitPressed}
    gameContainerMessage={controller.currentMessage}
    gameContainerSnippet={gameContainer}
    scoreContainerSnippet={scoreContainer}
    showMidiDevice
  />
  <div class="space-above-base">
    <NoteKeyboard
      onNoteClick={handleInput}
      preferFlats={controller.preferFlats}
    />
  </div>
</main>

{#snippet gameContainer()}
  <div
    class="start-container grid-center"
    class:hide={controller.status !== "idle"}
  >
    <Button
      class="space-above-lg"
      size="large"
      onclick={() => controller.start()}>Start</Button
    >
  </div>
  <div class="staff-container" class:hide={controller.status !== "playing"}>
    <VSMusicStaff
      bind:instance={musicStaffInstance}
      options={{
        staffType: config.clef,
        scale: 1.2,
        width: 200,
        noteStartX: 60,
        spaceAbove: staffSpacingObj.above,
        spaceBelow: staffSpacingObj.below,
      }}
    />
  </div>
{/snippet}
{#snippet scoreContainer()}
  <div class="score-item green">
    <p class="text-caption">Correct</p>
    <p class="text-heading-2">{controller.correctAnswers}</p>
  </div>
  <div class="score-item">
    <p class="text-caption">Time Left</p>
    <p class="text-heading-2">{controller.formattedTime}</p>
  </div>
  <div class="score-item red">
    <p class="text-caption">Wrong</p>
    <p class="text-heading-2">{controller.wrongAnswers}</p>
  </div>
{/snippet}

<style>
  main {
    padding: var(--space-8) var(--space-12);
  }
  div.hide {
    display: none;
  }
  .start-container {
    padding-block: var(--space-8);
  }
  .staff-container {
    display: flex;
    justify-content: center;
    padding-block: var(--space-12);
  }
</style>
