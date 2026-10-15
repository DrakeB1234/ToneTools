<script lang="ts">
	import {
		getBorrowedChordsFromScale,
		getChordAbsoulteOctave,
		getDiatonicChordsFromScale,
		getSecondaryDominantsFromScale
	} from "$lib/helpers/musicTheory";
	import { onDestroy, onMount } from "svelte";
	import { ProgressionPlayer } from "./chordProgressionPlayer.svelte";
	import { styleLibrary } from "./chordProgressionHelpers";
	import ActionBar from "./ActionBar.svelte";
	import ProgressionTimeline from "./ProgressionTimeline.svelte";
	import ChordPalette from "./ChordPalette.svelte";
	import TimelineSidebar from "./TimelineSidebar.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";

	const player = new ProgressionPlayer();
	const initialMasterVolume = Howler.volume() * 100;

	let currentScale = $state("major");
	let diatonicChords = $derived(getDiatonicChordsFromScale(player.globalKey, currentScale));
	let secondaryDominants = $derived(getSecondaryDominantsFromScale(player.globalKey, currentScale));
	let borrowedChords = $derived(getBorrowedChordsFromScale(player.globalKey, currentScale));
	let activeProgressionObjIndex = $state<number | null>(null);

	onMount(() => {
		const startingProgression = [
			{ chordInfo: getChordAbsoulteOctave("D", "m7"), beats: 4 },
			{ chordInfo: getChordAbsoulteOctave("G", "7"), beats: 4 },
			{ chordInfo: getChordAbsoulteOctave("C", "maj7"), beats: 4 },
			{ chordInfo: getChordAbsoulteOctave("A", "7"), beats: 4 }
		];
		const startStyleString = Object.keys(styleLibrary)[0];
		const startingStyle = styleLibrary[startStyleString].id;

		// Init progression with chords that MATCH key arg
		player.initPlayer(startingStyle, "C", startingProgression);
	});

	onDestroy(() => {
		player.stop();
		Howler.volume(initialMasterVolume / 100);
	});
</script>

<svelte:head>
	<title>Chord Progression | Tone Tools</title>
</svelte:head>

<Wrapper maxWidth="desktopfull">
	<main class="page">
		<ActionBar playerRef={player} bind:currentScale />

		<p class="section-title">Timeline</p>
		<ProgressionTimeline playerRef={player} bind:activeProgressionObjIndex />

		<p class="current-chord-text text-caption">
			{player.currentPlayedChord && `Current Chord: ${player.currentPlayedChord}`}
		</p>

		<p class="section-title">Chord Palette</p>
		<ChordPalette playerRef={player} {diatonicChords} {secondaryDominants} {borrowedChords} />
	</main>
</Wrapper>

<TimelineSidebar playerRef={player} bind:activeProgressionObjIndex />

<style>
	main {
		padding-top: var(--space-4);
	}
	.current-chord-text {
		margin-top: var(--space-4);
		min-height: 1.5rem;
	}
	.section-title {
		margin-top: var(--space-24);
		margin-bottom: var(--space-8);
	}
</style>
