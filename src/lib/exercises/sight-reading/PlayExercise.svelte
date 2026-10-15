<script lang="ts">
	import ExerciseLayout from "$lib/exercises/ExerciseLayout.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import { onMount } from "svelte";
	import { type ConfigOptions } from "./config";
	import { ExerciseController } from "./ExerciseController.svelte";
	import { midiService } from "$lib/midiservice/midiService.svelte";
	import VSStandardStaff from "$lib/components/VSStandardStaff.svelte";
	import { StandardStaff, type SystemTypes } from "vector-score";
	import NoteKeyboard from "$lib/components/UI/NoteKeyboard.svelte";

	type Props = {
		config: ConfigOptions;
		handleExit: () => void;
	};

	let { config, handleExit }: Props = $props();

	// svelte-ignore state_referenced_locally
	let musicStaffInstance: StandardStaff | null = $state(null);

	// svelte-ignore state_referenced_locally
	const controller = new ExerciseController(config);

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

<main class="page">
	<ExerciseLayout
		handleExitClick={handleExitPressed}
		gameContainerMessage={controller.currentMessage}
		gameContainerSnippet={gameContainer}
		scoreContainerSnippet={scoreContainer}
		showMidiDevice
	/>
	<div class="space-above-base">
		<NoteKeyboard onNoteClick={handleInput} preferFlats={controller.preferFlats} />
	</div>
</main>

{#snippet gameContainer()}
	<div class="start-container grid-center" class:hide={controller.status !== "idle"}>
		<Button class="space-above-lg" size="large" onclick={() => controller.start()}>Start</Button>
	</div>
	<div class="staff-container" class:hide={controller.status !== "playing"}>
		<VSStandardStaff
			bind:instance={musicStaffInstance}
			options={{
				staffType: controller.options.clef as SystemTypes,
				noteStartX: 110,
				paddingTop: 40,
				paddingBottom: 40
			}}
		/>
	</div>
{/snippet}
{#snippet scoreContainer()}
	<div class="score-item">
		<p class="text-caption">Correct</p>
		<p class="text-heading-2">{controller.correctAnswers}</p>
	</div>
	<div class="score-item">
		<p class="text-caption">Time Left</p>
		<p class="text-heading-2">{controller.formattedTime}</p>
	</div>
	<div class="score-item">
		<p class="text-caption">Wrong</p>
		<p class="text-heading-2">{controller.wrongAnswers}</p>
	</div>
{/snippet}

<style>
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
