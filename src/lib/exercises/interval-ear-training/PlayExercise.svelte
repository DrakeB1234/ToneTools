<script lang="ts">
	import Modal from "$lib/components/Modal/Modal.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import { onDestroy, onMount } from "svelte";
	import { ExerciseController } from "./ExerciseController.svelte";
	import type { ConfigOptions } from "./config";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import ConfirmationModalCard from "$lib/components/Modal/ConfirmationModalCard.svelte";
	import ExerciseLayout from "$lib/exercises/ExerciseLayout.svelte";
	import type { StandardStaff } from "vector-score";
	import VSStandardStaff from "$lib/components/VSStandardStaff.svelte";

	type Props = {
		config: ConfigOptions;
		handleExit: () => void;
	};

	let { config, handleExit }: Props = $props();

	// svelte-ignore state_referenced_locally
	const exerciseController = new ExerciseController(config);

	let isExitModalOpen = $state(false);
	let musicStaffInstance: StandardStaff | null = $state(null);

	function handleExitPressed() {
		if (exerciseController.isExerciseOver) {
			handleExit();
		} else {
			isExitModalOpen = true;
		}
	}

	function handleExitModalResponse(wantsExit: boolean) {
		if (wantsExit) {
			handleExit();
		}
		isExitModalOpen = false;
	}

	onMount(() => {
		if (musicStaffInstance) exerciseController.addVSStaffInstance(musicStaffInstance);
	});

	onDestroy(() => {
		Howler.stop();
		exerciseController.destroy();
	});
</script>

<main class="page">
	<ExerciseLayout
		handleExitClick={handleExitPressed}
		gameContainerMessage={exerciseController.currentMessage}
		gameContainerSnippet={gameContainer}
		scoreContainerSnippet={scoreContainer}
	/>
	<div class="input-wrapper space-above-base">
		{#each config.selectedIntervals as interval}
			<Button
				variant="text"
				style="padding: 0;"
				onclick={() => exerciseController.handleIntervalButtonClick(interval)}
			>
				<div
					class="input-container"
					class:correct={exerciseController.correctGuessInterval === interval}
					class:wrong={exerciseController.wrongGuessInterval === interval}
				>
					<p>{interval}</p>
				</div>
			</Button>
		{/each}
	</div>
	<div class="bottom-container flex-row">
		<Button
			variant="secondary"
			size="large"
			shape="circle"
			icon
			class="btn--fab"
			onclick={exerciseController.handleReplayIntervalClick}
		>
			<Icon icon="volumeUp" />
		</Button>
		<Button
			size="large"
			shape="circle"
			icon
			class="btn--fab"
			onclick={exerciseController.handleNextButtonClick}
			disabled={exerciseController.isNextQuestionDisabled}
		>
			<Icon icon="arrowRightAlt" />
		</Button>
	</div>
</main>

{#snippet gameContainer()}
	<div class="grid-center">
		<VSStandardStaff
			bind:instance={musicStaffInstance}
			options={{
				scale: 1,
				noteStartX: 40,
				width: 300,
				paddingTop: 55,
				paddingBottom: 40
			}}
		/>
	</div>
{/snippet}
{#snippet scoreContainer()}
	<div class="score-item">
		<p class="text-caption">Correct</p>
		<p class="text-heading-2">{exerciseController.correctAnswers}</p>
	</div>
	<div class="score-item">
		<p class="text-caption">Question</p>
		<p class="text-heading-2">
			{exerciseController.questionNumber}{config.questionsVariant !== "Endless"
				? `/${config.questionsVariant}`
				: ""}
		</p>
	</div>
	<div class="score-item">
		<p class="text-caption">Wrong</p>
		<p class="text-heading-2">{exerciseController.wrongAnswers}</p>
	</div>
{/snippet}

<Modal bind:isOpen={isExitModalOpen}>
	<ConfirmationModalCard
		title="Exit Exercise"
		message="Are you sure you want to exit this exercise? You still have questions left to answer."
		confirmationText="Exit"
		onResponse={handleExitModalResponse}
	/>
</Modal>

<style>
	.input-wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
		align-items: stretch;
		gap: var(--space-8);
		padding-bottom: var(--space-16);
	}
	.input-container {
		width: 100%;
		text-align: center;

		padding: var(--space-12);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-base);
	}
	.input-container.correct {
		border-color: var(--color-bg-correct);
	}
	.input-container.wrong {
		border-color: var(--color-bg-wrong);
	}

	.bottom-container {
		position: sticky;
		bottom: 0;

		justify-content: end;
		gap: var(--space-12);

		padding-block: var(--space-16);
	}
</style>
