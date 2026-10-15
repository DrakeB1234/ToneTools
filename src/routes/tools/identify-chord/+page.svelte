<script lang="ts">
	import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import PianoRoll from "$lib/components/Piano/PianoRoll.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { encodeUrlChord } from "$lib/helpers/helpers";
	import {
		convertMidiToNoteName,
		convertNoteNameToObj,
		detectChordsByNoteNames,
		sortNoteNames
	} from "$lib/helpers/musicTheory";
	import { onDestroy } from "svelte";

	let selectedNotes: string[] = $state([]);
	let identifiedChords = $derived(detectChordsByNoteNames(selectedNotes));

	function handlePianoNoteClick(midi: number) {
		const noteName = convertMidiToNoteName(midi);

		if (noteName) {
			if (selectedNotes.includes(noteName)) {
				selectedNotes = selectedNotes.filter((n) => n !== noteName);
			} else {
				selectedNotes = [...selectedNotes, noteName];

				pianoAudioService.playNote(convertNoteNameToObj(noteName), "low");
			}

			selectedNotes = sortNoteNames(selectedNotes);
		}
	}

	function handleResetNotesPressed() {
		selectedNotes = [];
	}

	onDestroy(() => {
		Howler.stop();
	});
</script>

<svelte:head>
	<title>Identify Chord | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Identify Chord" fallbackHref="/tools" useHistory={false} />

		<section class="panel card--tool space-above-sm">
			<PianoRoll
				activeNotes={selectedNotes}
				range={{
					startNote: "C4",
					endNote: "E7"
				}}
				overflowScroll
				interactive
				onNoteClick={handlePianoNoteClick}
			/>

			<div class="card-content space-above-base">
				<div class="flex-row">
					<p>Selected Notes:</p>
					<Button
						variant="text"
						size="small"
						icon
						title="reset all notes"
						onclick={handleResetNotesPressed}
					>
						<Icon icon="refresh" />
					</Button>
				</div>
				<div class="notes-container flex-row space-above-sm">
					{#each selectedNotes as note}
						<p class="text-separated">{note}</p>
					{/each}
				</div>
			</div>
		</section>

		<section class="flex-col space-above-base">
			<h3>Results</h3>
			<hr />
			<div class="chords-container">
				{#each identifiedChords as chord (chord.tonic + chord.symbol)}
					<Button
						element="a"
						variant="text"
						href={encodeUrlChord(chord.tonic!, chord.symbol)}
						class="btn--card"
					>
						<div class="flex-col lay-gap-none">
							<p>{chord.tonic + chord.symbol}</p>
							<div class="notes-container flex-row">
								{#each chord.notes as note (note)}
									<p class="text-separated text-body-subtle">{note}</p>
								{/each}
							</div>
						</div>
					</Button>
				{:else}
					<div class="empty-container">
						<p class="text-body-subtle">No chords found</p>
					</div>
				{/each}
			</div>
		</section>
	</main>
</Wrapper>

<style>
	.panel {
		padding: 0;
		padding-bottom: var(--space-8);
		overflow: hidden;
	}

	.card-content {
		padding: var(--space-12);
	}

	.notes-container {
		flex-wrap: wrap;
		gap: var(--space-4);

		width: 100%;
		min-height: 21px;
	}

	.chords-container {
		display: grid;
		gap: var(--space-8);
	}

	.empty-container {
		display: flex;
		justify-content: center;

		padding: var(--space-12) var(--space-16);
	}
</style>
