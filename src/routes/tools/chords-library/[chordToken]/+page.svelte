<script lang="ts">
	import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { onMount, untrack } from "svelte";
	import type { PageProps } from "./$types";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import {
		convertNoteNameToObj,
		getFullNoteNameFromObj,
		sortNoteNames
	} from "$lib/helpers/musicTheory";
	import { encodeUrlChord } from "$lib/helpers/helpers";
	import PianoRoll from "$lib/components/Piano/PianoRoll.svelte";
	import Guitar from "$lib/components/Icons/Guitar.svelte";
	import {
		determineBarreOptions,
		type GuitarBarreDef,
		type GuitarChord,
		type StandardStaff
	} from "vector-score";
	import VSStandardStaff from "$lib/components/VSStandardStaff.svelte";
	import VSGuitarChords from "$lib/components/VSGuitarChords.svelte";
	import { getVSChordConfig } from "$lib/helpers/vectorScoreHelpers";

	let { data }: PageProps = $props();

	let {
		chordObj,
		chordInversions,
		chordIntervals,
		chordAliases,
		similarChords,
		secondaryDominantChord,
		fullNoteNames,
		guitarChordObj,
		unSimplifiedNote
	} = $derived(data);

	let isChordInversions = $derived(data.chordInversions !== null);
	let currentInversionSelected = $derived(data.chordInversions ? 0 : 0);
	let pianoSnapshotNotes = $derived(fullNoteNames);

	type Tab = "piano" | "guitar" | "notation";
	let activeTab = $state<Tab>("piano");

	let musicStaffInstance = $state<StandardStaff | null>(null);
	let guitarChordsInstance = $state<GuitarChord | null>(null);

	function setPianoActive(value: Tab) {
		activeTab = value;
	}

	function drawChordVSStaff() {
		if (!musicStaffInstance) return;
		musicStaffInstance.clearAllNotes();

		const chordNoteObjs = sortNoteNames(pianoSnapshotNotes).map((note) =>
			convertNoteNameToObj(note)
		);
		musicStaffInstance.drawChord(getVSChordConfig(chordNoteObjs, "q"));
	}

	function drawChordsVSGuitarChord() {
		if (!guitarChordsInstance || !guitarChordObj) return;
		guitarChordsInstance.clearAllChords();

		guitarChordObj.chords.forEach((e, idx) => {
			let barres: GuitarBarreDef[] | undefined;

			if (e.barres) {
				const autoBarres = determineBarreOptions(e.frets, e.fingers, e.barres);
				barres = autoBarres;
			}

			guitarChordsInstance?.addChord(e.frets, e.fingers, {
				label: `v${idx + 1}`,
				barres: barres,
				startFret: e.baseFret ?? undefined
			});
		});
	}

	function handlePlayNote(index: number) {
		const note = chordObj.notes[index];
		if (note.octave === null) return;

		pianoAudioService.playNote(note, "med");
	}

	// Considers currently selected chord inversion, then plays those notes. Root inversion is set by default
	function handlePlayChord() {
		if (!chordInversions) {
			pianoAudioService.playChord(chordObj.notes);
		} else {
			pianoAudioService.playChord(chordInversions[currentInversionSelected].chord.notes);
		}
	}

	function handleInversionPressed(i: number) {
		if (!chordInversions) return;

		currentInversionSelected = i;
		const selectedInversionNotes = chordInversions[i].chord.notes;

		const noteFullNames = selectedInversionNotes.map((e) => getFullNoteNameFromObj(e));

		pianoSnapshotNotes = noteFullNames;
	}

	onMount(() => {
		return () => {
			Howler.stop();

			if (musicStaffInstance) musicStaffInstance = null;
			if (guitarChordsInstance) guitarChordsInstance = null;
		};
	});

	$effect(() => {
		if (musicStaffInstance) drawChordVSStaff();
		else if (guitarChordsInstance) drawChordsVSGuitarChord();
	});
</script>

<svelte:head>
	<title>{data.chordObj.tonic}{data.chordObj.symbol} Chord | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Back" fallbackHref="/tools/chords-library" />

		<section class="panel card--tool space-above-sm">
			<div class="flex-col lay-gap-none space-above-sm">
				<h1>
					{chordObj.tonic + chordObj.symbol}
					{#if unSimplifiedNote}
						<span class="text-body-subtle">&#10088;simplified from {unSimplifiedNote}&#10089;</span>
					{/if}
				</h1>
				<p class="text-body-subtle">{chordObj.name}</p>
			</div>

			<div class="aliases-container flex-row space-above-base">
				{#each chordAliases as alias (alias)}
					<p class="pill">{alias}</p>
				{/each}
			</div>

			<div class="piano-guitar-toggle flex-row scrollbar-custom lay-gap-16 space-above-xlg">
				<Button
					variant="text"
					size="small"
					active={activeTab === "piano"}
					title="Toggle piano view"
					onclick={() => setPianoActive("piano")}
				>
					<Icon icon="piano" />
					Piano
				</Button>
				<Button
					variant="text"
					size="small"
					active={activeTab === "guitar"}
					title="Toggle guitar view"
					onclick={() => setPianoActive("guitar")}
				>
					<Icon icon={Guitar} />
					Guitar
				</Button>
				<Button
					variant="text"
					size="small"
					active={activeTab === "notation"}
					title="Toggle guitar view"
					onclick={() => setPianoActive("notation")}
				>
					<Icon icon="queueMusic" />
					Notation
				</Button>
			</div>

			<hr class="divider space-above-base" />

			<div class="play-chord-container space-above-base">
				<Button onclick={handlePlayChord} size="small" icon>
					<Icon icon="volumeUp" />
				</Button>
			</div>
			<div class="flex-row lay-flex-wrap space-above-xsm">
				{#each chordObj.notes as note, index (note)}
					{@const displayNote = note.letter + (note.accidental ?? "")}

					<Button variant="outlined" onclick={() => handlePlayNote(index)}>
						{displayNote}
					</Button>
				{/each}
			</div>

			{#if activeTab === "piano"}
				<div class="piano-roll-container space-above-base">
					<PianoRoll
						activeNotes={pianoSnapshotNotes}
						range={{
							startNote: "C4",
							endNote: "C7"
						}}
						overflowScroll
					/>
				</div>
			{:else if activeTab === "guitar"}
				<div class="guitar-chords-container space-above-xlg">
					{#if !guitarChordObj}
						<div class="guitar-chords-container__not-found">
							<p>
								Guitar Database does not contain the {chordObj.tonic + chordObj.symbol} chord yet :&#40;
							</p>
						</div>
					{:else}
						<VSGuitarChords
							bind:instance={guitarChordsInstance}
							options={{ centerChords: false }}
						/>
					{/if}
				</div>
			{:else}
				<div class="music-staff-container grid-center space-above-base">
					<VSStandardStaff
						options={{
							staffType: "treble",
							scale: 1.3,
							noteStartX: 60,
							paddingTop: 40,
							paddingBottom: 40,
							width: 200
						}}
						bind:instance={musicStaffInstance}
					/>
				</div>
			{/if}

			<hr class="space-above-base" />

			<div class="panel panel--high space-above-lg">
				<h3>Intervals</h3>
				<div class="flex-row lay-gap-xsm">
					{#each chordIntervals as interval (interval)}
						<p class="text-separated text-body-subtle">{interval}</p>
					{/each}
				</div>
				<h3 class="space-above-base">
					Secondary Dominant <span class="text-body-subtle">(perfect 5th above root)</span>
				</h3>
				<p class="text-body-subtle">
					{secondaryDominantChord?.tonic}{secondaryDominantChord?.symbol}
				</p>
			</div>

			{#if isChordInversions}
				<h3 class="space-above-lg">Inversions</h3>
				<div class="flex-col space-above-xsm">
					{#each chordInversions as inversion, index (index)}
						<Button
							variant="outlined"
							active={currentInversionSelected === index}
							onclick={() => handleInversionPressed(index)}
							class="lay-justify-start"
						>
							<div class="inversion-button flex-row lay-gap-base">
								<p class="inversion-pill pill primary">
									{inversion.inversionName}
								</p>
								<div class="flex-col lay-align-start lay-gap-none">
									<p>{inversion.chord.tonic + inversion.chord.symbol}</p>
									<div class="flex-row lay-gap-none">
										{#each inversion.chord.notes as note}
											{@const displayNote = note.letter + (note.accidental ?? "")}

											<p class="text-separated text-body-subtle">
												{displayNote}&nbsp;
											</p>
										{/each}
									</div>
								</div>
							</div>
						</Button>
					{/each}
				</div>
			{/if}
		</section>

		<section class="space-above-lg">
			<h3>Similar Chords</h3>

			<hr class="space-above-sm" />

			<div class="similar-chords-container">
				{#each similarChords as chord}
					<Button element="a" href={encodeUrlChord(chord.tonic!, chord.symbol)} class="btn--card">
						<div class="flex-col lay-gap-none">
							<p>{chord.tonic + chord.symbol}</p>
							<p class="text-body-subtle">{chord.name}</p>
						</div>
					</Button>
				{/each}
			</div>
		</section>
	</main>
</Wrapper>

<style>
	.aliases-container {
		gap: var(--space-4);
		overflow-x: auto;
	}

	.play-chord-container {
		width: fit-content;
		margin-left: auto;
	}

	.piano-roll-container {
		/* Full Bleed, Negative margin */
		margin-left: calc(-1 * var(--space-16));
		margin-right: calc(-1 * var(--space-16));
	}

	.guitar-chords-container {
		margin-inline: auto;
		width: fit-content;
	}

	.piano-guitar-toggle {
		overflow-x: auto;
	}

	.guitar-chords-container__not-found {
		padding-block: var(--space-52);
	}

	.inversion-button {
		padding-block: var(--space-8);
	}

	.inversion-pill {
		width: 5ch;
	}

	.similar-chords-container {
		display: grid;
		gap: var(--space-8);

		margin-top: var(--space-16);
	}
</style>
