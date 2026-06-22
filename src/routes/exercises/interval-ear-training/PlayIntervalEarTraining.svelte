<script lang="ts">
  import ConfirmationCard from "$lib/components/Popups/ConfirmationPopupCard.svelte";
  import Popup from "$lib/components/Popups/Popup.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import { onDestroy, onMount } from "svelte";
  import { IntervalEarTrainingController } from "./intervalEarTrainingController.svelte";
  import type { IntervalEarConfig } from "./intervalEarTrainingHelpers";
  import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
  import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";

  type Props = {
    config: IntervalEarConfig;
    handleExit: () => void;
  };

  let { config, handleExit }: Props = $props();

  // svelte-ignore state_referenced_locally
  const exerciseController = new IntervalEarTrainingController(config);

  let isExitPopupOpen = $state(false);
  let staffElement: HTMLDivElement | null = $state(null);

  function handleExitPressed() {
    if (exerciseController.isExerciseOver) {
      handleExit();
    } else {
      isExitPopupOpen = true;
    }
  }

  function handleExitPopupResponse(wantsExit: boolean) {
    if (wantsExit) {
      handleExit();
    }
    isExitPopupOpen = false;
  }

  onMount(() => {
    pianoAudioService.init();
    sfxAudioService.init();

    if (staffElement) exerciseController.setupVectorScoreStaff(staffElement);
  });

  onDestroy(() => {
    pianoAudioService.stopAll();
    sfxAudioService.stopAll();
    exerciseController.destroy();
  });
</script>

<main>
  <Button variant="outlined" onclick={handleExitPressed}>Exit</Button>

  <div class="game-container">
    <div class="message-container">
      <p>{exerciseController.currentMessage}</p>
    </div>
    <div class="staff-container" bind:this={staffElement}></div>
  </div>

  <div class="score-container">
    <div class="score-item red">
      <p class="text-caption">Wrong</p>
      <p class="text-heading-2">{exerciseController.wrongAnswers}</p>
    </div>
    <div class="score-item">
      <p class="text-caption">Question</p>
      <p class="text-heading-2">
        {exerciseController.questionNumber}/{config.questionsAmount}
      </p>
    </div>
    <div class="score-item green">
      <p class="text-caption">Correct</p>
      <p class="text-heading-2">{exerciseController.correctAnswers}</p>
    </div>
  </div>

  <div class="input-wrapper">
    {#each exerciseController.selectedIntervals as intervalObj (intervalObj.interval)}
      <InteractiveElement
        variant="text"
        style="padding: 0;"
        fullWidth
        onclick={() =>
          exerciseController.handleIntervalButtonClick(intervalObj.interval)}
      >
        <div
          class="input-container"
          class:correct={exerciseController.correctGuessInterval ===
            intervalObj.interval}
          class:wrong={exerciseController.wrongGuessInterval ===
            intervalObj.interval}
        >
          <p>{intervalObj.name}</p>
        </div>
      </InteractiveElement>
    {/each}
  </div>

  <div class="bottom-container lay-row">
    <Button
      variant="secondary"
      size="icon-large"
      circle
      onclick={exerciseController.handleReplayIntervalClick}
    >
      <Icon icon="volumeUp" />
    </Button>
    <Button
      size="icon-large"
      circle
      onclick={exerciseController.handleNextButtonClick}
      disabled={exerciseController.isNextQuestionDisabled}
    >
      <Icon icon="arrowRightAlt" />
    </Button>
  </div>
</main>

<Popup bind:isOpen={isExitPopupOpen}>
  <ConfirmationCard
    title="Exit Exercise"
    message="Are you sure you want to exit this exercise? Any stats from this session will be lost."
    confirmationText="Exit"
    onResponse={handleExitPopupResponse}
  />
</Popup>

<style>
  main {
    display: flex;
    flex-direction: column;

    padding: var(--space-8) var(--space-12);
  }

  .game-container {
    margin-top: var(--space-8);

    border: 1px solid var(--color-border-subtle);
    background-color: var(--color-bg-surface-1);
  }

  .staff-container {
    display: flex;
    justify-content: center;
    padding-block: var(--space-12);
  }

  .message-container {
    display: grid;
    place-items: center;

    padding-top: var(--space-4);
  }

  .score-container {
    display: flex;
    justify-content: space-between;

    padding-top: var(--space-4);
    padding-bottom: var(--space-16);
  }

  .score-item {
    text-align: center;
  }
  .score-item:first-child {
    text-align: left;
  }
  .score-item:last-child {
    text-align: right;
  }

  .green p {
    color: var(--color-bg-addon-green);
  }
  .red p {
    color: var(--color-bg-danger);
  }

  .input-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11em, 1fr));
    align-items: stretch;
    gap: var(--space-8);
    padding-bottom: var(--space-16);
  }
  .input-container {
    width: 100%;
    text-align: center;

    padding: var(--space-12);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
  }
  .input-container.correct {
    border-color: var(--color-bg-addon-green-contrast);
  }
  .input-container.wrong {
    border-color: var(--color-bg-addon-red-contrast);
  }

  .bottom-container {
    position: sticky;
    bottom: 0;

    justify-content: end;
    gap: var(--space-12);

    padding-block: var(--space-16);
  }
</style>
