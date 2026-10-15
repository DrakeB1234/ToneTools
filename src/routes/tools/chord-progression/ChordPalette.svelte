<script lang="ts">
	import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import NoteInput from "$lib/components/UI/NoteInput.svelte";
	import Select from "$lib/components/UI/Select.svelte";
	import { getChord, getChordAbsoulteOctave } from "$lib/helpers/musicTheory";
	import { simpleChordSymbols } from "$lib/helpers/musicTheoryConstants";
	import type { DiatonicChordSet, GeneralChord } from "$lib/types/musicTheoryTypes";
	import type { ProgressionPlayer } from "./chordProgressionPlayer.svelte";

	type Props = {
		playerRef: ProgressionPlayer;
		diatonicChords: DiatonicChordSet[] | null;
		secondaryDominants: DiatonicChordSet[] | null;
		borrowedChords: DiatonicChordSet[] | null;
	};
	let { playerRef, diatonicChords, secondaryDominants, borrowedChords }: Props = $props();

	let currentActiveTab: string = $state("diatonic");
	let isDiatonicPaletteAddMode = $state(true);

	let customRootNote: string = $state("C");
	let customRootSymbol: string = $state("maj");

	function handleCustomChordAdd() {
		const chordObj = getChordAbsoulteOctave(customRootNote, customRootSymbol);
		if (!chordObj) return;

		playerRef.progression.push({
			beats: 4,
			chordInfo: chordObj
		});
	}

	function handleCustomChordPlay() {
		const chordObj = getChord(customRootNote, customRootSymbol);
		if (!chordObj) return;

		pianoAudioService.playChord(chordObj.notes, "high");
	}

	function handleTabChange(tab: string) {
		currentActiveTab = tab;
	}

	function handleChordButtonClick(
		degreeIdx: number,
		chordIdx: number,
		type: "diatonic" | "secondary dom" | "borrowed" = "diatonic"
	) {
		let selectedChord: Pick<GeneralChord, "symbol" | "tonic"> | null = null;
		if (type === "diatonic" && diatonicChords) {
			selectedChord = diatonicChords[degreeIdx].chords[chordIdx];
		} else if (type === "secondary dom" && secondaryDominants) {
			selectedChord = secondaryDominants[degreeIdx].chords[chordIdx];
		} else if (type === "borrowed" && borrowedChords) {
			selectedChord = borrowedChords[degreeIdx].chords[chordIdx];
		}
		if (!selectedChord) return;

		const selectedChordObj = getChord(selectedChord.tonic, selectedChord.symbol);
		if (!selectedChordObj) return;

		if (isDiatonicPaletteAddMode) {
			playerRef.progression.push({
				beats: 4,
				chordInfo: selectedChordObj
			});
		} else {
			pianoAudioService.playChord(selectedChordObj.notes, "high");
		}
	}

	// Sends data to sibling component 'ProgressionTimeline' to add chord into timeline
	function handleDragStart(e: DragEvent, chord: any) {
		if (!e.dataTransfer) return;

		const payload = JSON.stringify({
			tonic: chord.tonic,
			symbol: chord.symbol
		});

		e.dataTransfer.setData("text/plain", payload);
		e.dataTransfer.effectAllowed = "copy";
	}
</script>

<section>
	<div class="tabs flex-row lay-gap-xsm">
		<Button
			variant="text"
			class="btn--tab"
			active={currentActiveTab === "diatonic"}
			onclick={() => handleTabChange("diatonic")}
			aria-label="Toggle active chord tab to diatonic"
			title="Toggle active chord tab to diatonic">Diatonic</Button
		>
		<Button
			variant="text"
			class="btn--tab"
			active={currentActiveTab === "secondary dom"}
			onclick={() => handleTabChange("secondary dom")}
			aria-label="Toggle active chord tab to secondary dom"
			title="Toggle active chord tab to secondary dom">Secondary Dom</Button
		>
		<Button
			variant="text"
			class="btn--tab"
			active={currentActiveTab === "borrowed"}
			onclick={() => handleTabChange("borrowed")}
			aria-label="Toggle active chord tab to borrowed"
			title="Toggle active chord tab to borrowed">Borrowed</Button
		>
		<Button
			variant="text"
			class="btn--tab"
			active={currentActiveTab === "custom"}
			onclick={() => handleTabChange("custom")}
			aria-label="Toggle active chord tab to custom"
			title="Toggle active chord tab to custom">Custom</Button
		>
	</div>

	<hr />

	<section
		class="diatonic-palette flex-col space-above-base"
		class:hide={currentActiveTab !== "diatonic"}
	>
		<div class="diatnoic-palette__volume-toggle">
			<Button
				variant="outlined"
				size="small"
				icon
				active={isDiatonicPaletteAddMode}
				onclick={() => (isDiatonicPaletteAddMode = !isDiatonicPaletteAddMode)}
				aria-label="Toggle add / hear chord mode"
				title="Toggle add / hear chord mode"
			>
				<Icon icon="volumeUp" />
			</Button>
		</div>
		{#each diatonicChords as diatonicObj, i (diatonicObj.degree)}
			<div class="diatonic-palette__section flex-row">
				<p class="diatonic-palette__degree">{diatonicObj.degree}</p>
				{#each diatonicObj.chords as chord, j (chord)}
					{@const chordName = `${chord.tonic}${chord.symbol}`}
					{@const instruction = isDiatonicPaletteAddMode
						? "Click to add to timeline or drag."
						: "Click to hear audio."}

					<Button
						variant="secondary"
						class="btn--wide"
						onclick={() => handleChordButtonClick(i, j)}
						draggable="true"
						ondragstart={(e: DragEvent) => handleDragStart(e, chord)}
						aria-label="{chordName}. {instruction}"
						title={instruction}
					>
						<p class="text-heading-3">{chord.tonic}{chord.symbol}</p>
					</Button>
				{/each}
			</div>
		{/each}
	</section>

	<section
		class="diatonic-palette flex-col space-above-base"
		class:hide={currentActiveTab !== "secondary dom"}
	>
		<div class="diatnoic-palette__volume-toggle">
			<Button
				variant="outlined"
				size="small"
				icon
				active={isDiatonicPaletteAddMode}
				onclick={() => (isDiatonicPaletteAddMode = !isDiatonicPaletteAddMode)}
				aria-label="Toggle add / hear chord mode"
				title="Toggle add / hear chord mode"
			>
				<Icon icon="volumeUp" />
			</Button>
		</div>
		{#each secondaryDominants as secondaryDominantObj, i (secondaryDominantObj.degree)}
			<div class="diatonic-palette__section flex-row">
				<p class="diatonic-palette__degree">{secondaryDominantObj.degree}</p>
				{#each secondaryDominantObj.chords as chord, j (chord)}
					{@const chordName = `${chord.tonic}${chord.symbol}`}
					{@const instruction = isDiatonicPaletteAddMode
						? "Click to add to timeline or drag."
						: "Click to hear audio."}

					<Button
						variant="secondary"
						class="btn--wide"
						onclick={() => handleChordButtonClick(i, j, "secondary dom")}
						draggable="true"
						ondragstart={(e: DragEvent) => handleDragStart(e, chord)}
						aria-label="{chordName}. {instruction}"
						title={instruction}
					>
						<p class="text-heading-3">{chord.tonic}{chord.symbol}</p>
					</Button>
				{/each}
			</div>
		{/each}
	</section>

	<section
		class="diatonic-palette flex-col space-above-base"
		class:hide={currentActiveTab !== "borrowed"}
	>
		<div class="diatnoic-palette__volume-toggle">
			<Button
				variant="outlined"
				size="small"
				icon
				active={isDiatonicPaletteAddMode}
				onclick={() => (isDiatonicPaletteAddMode = !isDiatonicPaletteAddMode)}
				aria-label="Toggle add / hear chord mode"
				title="Toggle add / hear chord mode"
			>
				<Icon icon="volumeUp" />
			</Button>
		</div>
		{#each borrowedChords as borrowedChordObj, i (borrowedChordObj.degree)}
			<div class="diatonic-palette__section flex-row">
				<p class="diatonic-palette__degree">{borrowedChordObj.degree}</p>
				{#each borrowedChordObj.chords as chord, j (chord)}
					{@const chordName = `${chord.tonic}${chord.symbol}`}
					{@const instruction = isDiatonicPaletteAddMode
						? "Click to add to timeline or drag."
						: "Click to hear audio."}

					<Button
						variant="secondary"
						class="btn--wide"
						onclick={() => handleChordButtonClick(i, j, "borrowed")}
						draggable="true"
						ondragstart={(e: DragEvent) => handleDragStart(e, chord)}
						aria-label="{chordName}. {instruction}"
						title={instruction}
					>
						<p class="text-heading-3">{chordName}</p>
					</Button>
				{/each}
			</div>
		{/each}
	</section>

	<section class="custom-section space-above-xlg" class:hide={currentActiveTab !== "custom"}>
		<NoteInput bind:activeNote={customRootNote} />
		<div class="custom__chord-select space-above-lg">
			<Select bind:value={customRootSymbol} options={simpleChordSymbols} />
		</div>
		<div class="custom__buttons flex-row space-above-base">
			<Button variant="secondary" fullWidth onclick={handleCustomChordPlay}>Play</Button>
			<Button fullWidth onclick={handleCustomChordAdd}>Add</Button>
		</div>
	</section>
</section>

<style>
	.hide {
		display: none;
	}
	.tabs {
		padding-bottom: var(--space-12);
		overflow-x: auto;
	}
	.diatonic-palette {
		min-width: 0;
		overflow-x: auto;
	}
	.diatonic-palette__section {
		align-items: stretch;
	}
	.diatonic-palette__degree {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		width: 100%;
		max-width: 7ch;
		margin: 0;
		padding-right: var(--space-16);

		border-right: 1px solid var(--color-border);
	}

	.custom-section {
		width: 100%;
		max-width: 340px;
		margin-inline: auto;
	}
	.custom__chord-select {
		width: fit-content;
	}
	.custom__buttons {
		width: 100%;
	}
</style>
