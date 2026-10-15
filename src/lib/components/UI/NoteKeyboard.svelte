<script lang="ts">
	import Button from "$lib/components/UI/Button.svelte";
	import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";

	type Props = {
		preferFlats?: boolean;
		onNoteClick: (note: string) => void;
	};

	let { preferFlats = $bindable(false), onNoteClick }: Props = $props();
</script>

<div class="note-input flex-col">
	<div class="note-input__buttons flex-row">
		{#each naturalNoteNames as note}
			{@const fullNote = `${note}${preferFlats ? "b" : "#"}`}

			<Button variant="outlined" class="btn--note" onclick={() => onNoteClick(fullNote)}>
				{fullNote}
			</Button>
		{/each}
	</div>

	<div class="note-input__buttons flex-row">
		{#each naturalNoteNames as note}
			<Button variant="outlined" class="btn--note" onclick={() => onNoteClick(note)}>
				{note}
			</Button>
		{/each}
	</div>
</div>

<style>
	.note-input {
		width: 100%;
		max-width: calc((var(--space-4) * 6) + 54px * 7);
		margin-inline: auto;
	}
</style>
