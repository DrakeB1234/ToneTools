<script lang="ts">
	import NoteInput from "$lib/components/UI/NoteInput.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { encodeUrlScale } from "$lib/helpers/helpers";
	import { getAllModes } from "$lib/helpers/musicTheory";

	let scales = getAllModes();
	let inputNote = $state("C");
</script>

<svelte:head>
	<title>Scales Library | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Scales Library" fallbackHref="/tools" useHistory={false} />

		<section class="panel card--tool space-above-sm">
			<NoteInput bind:activeNote={inputNote} hideEnharmonics={false} />
		</section>

		<p class="text-heading-3 space-above-lg">Scales</p>
		<hr class="space-above-sm" />
		<div class="scales-container flex-col space-above-base">
			{#each scales as scale (scale)}
				<Button
					element="a"
					variant="outlined"
					href={encodeUrlScale(inputNote, scale)}
					class="btn--card"
				>
					<div class="flex-col lay-gap-none">
						<p>{inputNote}&nbsp;{scale}</p>
						<p class="text-body-subtle">{scale}</p>
					</div>
				</Button>
			{/each}
		</div>
	</main>
</Wrapper>

<style>
	.scales-container {
		gap: var(--space-8);
	}
</style>
