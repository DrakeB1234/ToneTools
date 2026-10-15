<script lang="ts">
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { onDestroy } from "svelte";
	import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
	import type { PageProps } from "./$types";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Label from "$lib/components/UI/Label.svelte";
	import Toggle from "$lib/components/UI/Toggle.svelte";
	import { simplifyNoteName } from "$lib/helpers/musicTheory";
	import PianoRoll from "$lib/components/Piano/PianoRoll.svelte";

	// Values

	const playScaleDelayMs: number = 500;
	let playScaleInterval: ReturnType<typeof setInterval> | null = $state(null);
	let currentPlayedScaleIdx: number | null = $state(null);

	let isSimplifyNotesSelected = $state(false);

	let { data }: PageProps = $props();

	// Audio player handlers

	function handlePlayNote(index: number) {
		const note = data.scaleNotes[index];

		pianoAudioService.playNote(note, "med");
	}

	function handlePlayChord(triadIndex: number) {
		const triad = data.triads[triadIndex];

		if (!triad) return;

		pianoAudioService.playChord(triad.notes, "med");
	}

	// Play Scale Interval - Play all notes in scale

	function resetPlayScaleInterval() {
		if (playScaleInterval) {
			clearInterval(playScaleInterval);
			playScaleInterval = null;
			currentPlayedScaleIdx = null;
		}
	}

	function handlePlayScale() {
		resetPlayScaleInterval();

		// Start playing first note at call
		pianoAudioService.playNote(data.scaleNotes[0], "low");
		currentPlayedScaleIdx = 1;

		playScaleInterval = setInterval(() => {
			if (currentPlayedScaleIdx === null) currentPlayedScaleIdx = 1;
			if (currentPlayedScaleIdx >= data.scaleNotes.length) {
				resetPlayScaleInterval();
				return;
			}

			const currentNote = data.scaleNotes[currentPlayedScaleIdx];
			pianoAudioService.playNote(currentNote, "low");

			currentPlayedScaleIdx++;
		}, playScaleDelayMs);
	}

	onDestroy(() => {
		resetPlayScaleInterval();
		Howler.stop();
	});
</script>

<svelte:head>
	<title>{data.noteToken}&nbsp;{data.scaleToken} Scale | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Back" fallbackHref="/tools/scales-library" />

		<section class="panel card--tool space-above-sm">
			<div class="scale-notes-header">
				<div>
					<h1>{data.noteToken}&nbsp;{data.scaleToken}&nbsp;Scale</h1>
				</div>
				<Button size="small" icon onclick={handlePlayScale}>
					<Icon icon="volumeUp" />
				</Button>
			</div>
			<div class="toggle-button-container">
				<Label labelFor="simplify-notes">Simplify Notes</Label>
				<Toggle
					bind:toggled={isSimplifyNotesSelected}
					id="simplify-notes"
					ariaLabel="Enable Simplified Notes"
				/>
			</div>

			<hr class="space-above-base" />

			<div class="scale-notes-container flex-row lay-flex-wrap space-above-base">
				{#each data.scaleNotes as note, index (note)}
					{@const rawNote = note.letter + (note.accidental ?? "")}
					{@const displayNote = isSimplifyNotesSelected ? simplifyNoteName(rawNote) : rawNote}

					<Button
						variant="outlined"
						icon
						onclick={() => handlePlayNote(index)}
						active={currentPlayedScaleIdx === index + 1}>{displayNote}</Button
					>
				{/each}
			</div>

			<div class="piano-roll-container">
				<PianoRoll
					activeNotes={data.pianoRollNotes}
					range={{
						startNote: "C4",
						endNote: "C7"
					}}
					overflowScroll
				/>
			</div>

			<div class="panel panel--high">
				<h3 class="text-heading-3">Numerals</h3>
				<div class="space-above-sm flex-row lay-gap-xsm">
					{#each data.numerals as note (note)}
						<p class="text-separated">{note}</p>
					{/each}
				</div>

				<hr class="divider" />

				<h3 class="text-heading-3">
					Formula <span class="text-caption">(relative to major)</span>
				</h3>
				<div class="space-above-sm flex-row lay-gap-xsm">
					{#each data.formula as note (note)}
						<p class="text-separated">{note}</p>
					{/each}
				</div>

				<hr class="divider" />
				<h3 class="text-heading-3">Relative Modes</h3>
				<p class="space-above-sm">
					{data.relativeModes?.majorMode}&nbsp;|&nbsp;{data.relativeModes?.minorMode}
				</p>
			</div>
		</section>

		<p class="text-heading-3 space-above-lg">Diatonic Chords</p>
		<hr class="space-above-sm" />
		<div class="flex-col space-above-base">
			{#each data.triads as triadObj, index (triadObj.name)}
				<Button variant="outlined" onclick={() => handlePlayChord(index)} class="btn--card">
					<div class="flex-row lay-gap-base">
						<h3 class="pill primary">{data.numerals[index]}</h3>
						<div class="text-container">
							<h3>{triadObj.tonic + triadObj.symbol}</h3>
							<div class="flex-row">
								{#each triadObj.notes as note, i (note)}
									{@const rawNote = note.letter + (note.accidental ?? "")}
									{@const displayNote = isSimplifyNotesSelected
										? simplifyNoteName(rawNote)
										: rawNote}
									<p class="text-separated text-body-subtle">
										{displayNote}
									</p>
								{/each}
							</div>
						</div>
					</div>
				</Button>
			{/each}
		</div>
	</main>
</Wrapper>

<style>
	.toggle-button-container {
		width: fit-content;
		margin-left: auto;

		margin-top: 4em;
	}

	.scale-notes-header {
		display: flex;
		gap: var(--space-16);
		justify-content: space-between;
		align-items: center;
	}

	.piano-roll-container {
		/* Full Bleed, Negative margin */
		margin-left: calc(-1 * var(--space-16));
		margin-right: calc(-1 * var(--space-16));

		margin-block: var(--space-24);
		border-bottom: 3px solid var(--color-border);
	}

	.divider {
		margin-block: var(--space-16);
	}

	.text-container {
		text-align: left;
	}

	.pill {
		min-width: 4ch;
	}
</style>
