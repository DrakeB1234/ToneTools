<script lang="ts">
	import "$lib/components/Modal/modal.css";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import {
		accidentalVariants,
		noteRangeVariants,
		staffVariants,
		timerVariants,
		type AccidentalVariants,
		type ConfigOptions
	} from "./config";

	type ConfigProps = {
		configData: ConfigOptions;
		rangeStr: string;
		onComplete: () => void;
	};

	let { configData = $bindable(), rangeStr = $bindable(), onComplete }: ConfigProps = $props();

	function handleAccidentalClick(acc: AccidentalVariants) {
		if (configData.selectedAccidentals.includes(acc)) {
			configData.selectedAccidentals = configData.selectedAccidentals.filter((a) => a !== acc);
		} else {
			configData.selectedAccidentals = [...configData.selectedAccidentals, acc];
		}
	}
</script>

<div class="modal-card">
	<div class="modal-header">
		<h2 class="text-heading-3">Configure</h2>
		<Button variant="text" size="small" icon onclick={onComplete}>
			<Icon icon="close" />
		</Button>
	</div>

	<div class="modal-body flex-col">
		<div class="flex-col">
			<p class="text-caption">Staff</p>
			<div class="flex-row">
				{#each staffVariants as variant}
					<Button
						variant="outlined"
						active={configData.staff === variant}
						onclick={() => (configData.staff = variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>

		<div class="flex-col">
			<p class="text-caption">Accidentals</p>
			<div class="flex-row">
				{#each accidentalVariants as variant}
					<Button
						variant="outlined"
						icon
						active={configData.selectedAccidentals.includes(variant)}
						onclick={() => handleAccidentalClick(variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>

		<div class="flex-col">
			<p class="text-caption">Note Range <span class="text-caption-subtle">({rangeStr})</span></p>
			<div class="flex-row">
				{#each noteRangeVariants as variant}
					<Button
						variant="outlined"
						active={configData.noteRange === variant}
						onclick={() => (configData.noteRange = variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>

		<div class="flex-col">
			<p class="text-caption">Timer</p>
			<div class="flex-row">
				{#each timerVariants as variant}
					<Button
						variant="outlined"
						active={configData.timer === variant}
						onclick={() => (configData.timer = variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="modal-footer">
		<Button onclick={onComplete}>Apply</Button>
	</div>
</div>

<style>
	.modal-body {
		gap: var(--space-24);
	}
</style>
