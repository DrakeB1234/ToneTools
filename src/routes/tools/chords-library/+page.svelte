<script lang="ts">
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { getAllCategoryChords } from "$lib/helpers/musicTheory";
	import { chordCategories } from "$lib/helpers/musicTheoryConstants";
	import Button from "$lib/components/UI/Button.svelte";
	import { encodeUrlChord } from "$lib/helpers/helpers";
	import NoteInput from "$lib/components/UI/NoteInput.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";

	let inputNote = $state("C");
	let inputChordCategory = $state("Common");
	let categoryChords = $derived(getAllCategoryChords(inputChordCategory) ?? []);

	function handleChordCategoryButtonPressed(category: string) {
		inputChordCategory = category;
	}
</script>

<svelte:head>
	<title>Chords Library | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Chords Library" fallbackHref="/tools" useHistory={false} />

		<section class="panel card--tool space-above-sm">
			<NoteInput bind:activeNote={inputNote} hideEnharmonics={false} />

			<div class="toggle-buttons-container space-above-xlg">
				{#each chordCategories as category (category)}
					<Button
						variant="outlined"
						active={inputChordCategory === category}
						onclick={() => handleChordCategoryButtonPressed(category)}
						aria-label="Show chords under category {category}">{category}</Button
					>
				{/each}
			</div>
		</section>

		<p class="text-heading-3 space-above-lg">Chords</p>
		<hr class="space-above-sm" />
		<div class="chord-categories-container space-above-base">
			{#each categoryChords as chord (chord.symbol)}
				<Button
					element="a"
					variant="outlined"
					href={encodeUrlChord(inputNote, chord.symbol)}
					class="btn--card"
				>
					<div class="flex-col lay-gap-none">
						<p>{inputNote + chord.symbol}</p>
						<p class="text-body-subtle text-truncate">{chord.name}</p>
					</div>
				</Button>
			{/each}
		</div>
	</main>
</Wrapper>

<style>
	.toggle-buttons-container {
		display: flex;
		overflow-x: auto;
		width: 100%;
		gap: var(--space-8);
		mask-image: var(--mask-image-horizontal-fade);

		padding-bottom: var(--space-8);
		padding-right: 2em;
	}

	.chord-categories-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-8);
	}

	@media (max-width: 768px) {
		.chord-categories-container {
			grid-template-columns: 1fr;
		}
	}
</style>
