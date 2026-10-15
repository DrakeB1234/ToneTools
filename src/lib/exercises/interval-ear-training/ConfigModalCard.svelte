<script lang="ts">
	import "$lib/components/Modal/modal.css";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import {
		intervals,
		octaveVariants,
		playModeVariants,
		questionVariants,
		type ConfigOptions,
		type Intervals,
		type OctaveVariants,
		type PlayModeVariants,
		type QuestionVariants
	} from "./config";
	import { sortIntervals } from "./helpers";

	type ConfigProps = {
		configData: ConfigOptions;
		onComplete: () => void;
	};

	let { configData = $bindable(), onComplete }: ConfigProps = $props();

	let tempIntervals: Intervals[] = $state([...configData.selectedIntervals]);

	function handleIntervalClick(interval: Intervals) {
		if (tempIntervals.includes(interval)) {
			const index = tempIntervals.indexOf(interval);
			tempIntervals.splice(index, 1);
		} else {
			tempIntervals.push(interval);
		}
	}

	function handleIntervalToggleAll() {
		if (tempIntervals.length === intervals.length) {
			tempIntervals = [];
		} else {
			tempIntervals = [...intervals];
		}
	}

	function handleModeClick(type: PlayModeVariants) {
		if (configData.selectedPlayModes.includes(type)) {
			configData.selectedPlayModes = configData.selectedPlayModes.filter((t) => t !== type);
		} else {
			configData.selectedPlayModes = [...configData.selectedPlayModes, type];
		}
	}

	function handleQuestionsClick(variant: QuestionVariants) {
		configData.questionsVariant = variant;
	}

	function handleOctaveClick(variant: OctaveVariants) {
		configData.octaveRange = variant;
	}

	function handleApply() {
		sortIntervals(tempIntervals);
		configData.selectedIntervals = tempIntervals;

		onComplete();
	}
</script>

<div class="modal-card">
	<div class="modal-header">
		<h2 class="text-heading-3">Configure</h2>
		<Button variant="text" size="small" icon onclick={handleApply}>
			<Icon icon="close" />
		</Button>
	</div>

	<div class="modal-body flex-col">
		<div class="flex-col">
			<div class="intervals-header flex-row">
				<p class="text-caption">Intervals</p>
				<Button
					variant="text"
					size="small"
					title="Toggle all intervals"
					onclick={handleIntervalToggleAll}
				>
					All
				</Button>
			</div>
			<div class="interval-buttons flex-row lay-flex-wrap">
				{#each intervals as interval}
					<Button
						variant="secondary"
						icon
						active={tempIntervals.includes(interval)}
						onclick={() => handleIntervalClick(interval)}>{interval}</Button
					>
				{/each}
			</div>
		</div>

		<div class="flex-col">
			<p class="text-caption">Modes</p>
			<div class="flex-row">
				{#each playModeVariants as variant}
					<Button
						variant="outlined"
						active={configData.selectedPlayModes.includes(variant)}
						onclick={() => handleModeClick(variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>

		<div class="flex-col">
			<p class="text-caption">Octave Range</p>
			<div class="flex-row">
				{#each octaveVariants as variant}
					<Button
						variant="outlined"
						active={configData.octaveRange === variant}
						onclick={() => handleOctaveClick(variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>

		<div class="flex-col">
			<p class="text-caption">Questions</p>
			<div class="flex-row">
				{#each questionVariants as variant}
					<Button
						variant="outlined"
						active={configData.questionsVariant === variant}
						onclick={() => handleQuestionsClick(variant)}>{variant}</Button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="modal-footer">
		<Button onclick={handleApply}>Apply</Button>
	</div>
</div>

<style>
	.modal-body {
		gap: var(--space-24);
	}

	.intervals-header {
		align-items: end;
		justify-content: space-between;
	}
</style>
