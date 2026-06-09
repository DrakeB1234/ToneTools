<script lang="ts">
  import ConfirmationCard from "$lib/components/Popups/ConfirmationCard.svelte";
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
  });

  onDestroy(() => {
    pianoAudioService.stopAll();
    sfxAudioService.stopAll();
  });
</script>

<main>
  <div class="exit-container">
    <Button
      color="surface"
      variant="outline"
      size="large"
      onclick={handleExitPressed}>Exit</Button
    >
  </div>

  <div class="staff-container">
    <div class="message-container">
      <p>{exerciseController.currentMessage}</p>
    </div>
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
        element="button"
        variant="outline"
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
          {intervalObj.name}
        </div>
      </InteractiveElement>
    {/each}
  </div>

  <div class="bottom-container">
    <button
      class="btn refresh-button"
      onclick={exerciseController.handleReplayIntervalClick}
    >
      <Icon icon="volumeUp" />
    </button>
    <button
      class="btn next-button"
      onclick={exerciseController.handleNextButtonClick}
      disabled={exerciseController.isNextQuestionDisabled}
    >
      <Icon icon="arrowRightAlt" />
    </button>
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
    min-height: 700px;
  }

  .staff-container {
    min-height: 10em;
    margin-top: var(--space-8);

    border: 1px solid var(--color-border);
    background-color: var(--color-bg-surface);
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
    color: var(--color-deco-green-base);
  }
  .red p {
    color: var(--color-deco-red-base);
  }

  .input-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11em, 1fr));
    align-items: stretch;
    gap: var(--space-8);
  }
  .input-container {
    width: 100%;
    text-align: center;

    padding: var(--space-12);
    border: 1px solid transparent;
    border-radius: var(--radius-8);
  }
  .input-container.correct {
    border-color: var(--color-deco-green-base);
  }
  .input-container.wrong {
    border-color: var(--color-deco-red-base);
  }

  .bottom-container {
    position: sticky;
    bottom: 0;

    display: flex;
    justify-content: end;
    gap: var(--space-16);

    padding-block: var(--space-12);
    margin-top: auto;
  }
  .refresh-button,
  .next-button {
    background-color: var(--color-bg-surface);
    color: var(--color-text);

    border-radius: var(--radius-full);
    padding: var(--space-12);

    box-shadow: var(--shadow-elevation-1);
  }
  .refresh-button:hover {
    background-color: var(--color-surface-hover);
  }
  .next-button {
    background-color: var(--color-bg-brand);
    color: var(--color-text-inverse);
  }
  .next-button:hover:not(:disabled) {
    background-color: var(--color-brand-hover);
  }

  .next-button:disabled {
    background-color: var(--color-surface-disabled);
  }
</style>
