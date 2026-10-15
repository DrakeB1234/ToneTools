<script lang="ts">
	import { goto } from "$app/navigation";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Modal from "$lib/components/Modal/Modal.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import ConfigModalCard from "$lib/exercises/interval-ear-training/ConfigModalCard.svelte";
	import {
		defaultConfig,
		quickIntervalVariants,
		quickIntervalVariantValues,
		type IntervalSelectOptions
	} from "$lib/exercises/interval-ear-training/config";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import { exercisesData } from "$lib/data/appData";
	import MainExerciseCard from "$lib/exercises/MainExerciseCard.svelte";

	let exerciseAppData = exercisesData.find((e) => e.href === "/exercises/interval-ear-training")!;
	let configOptions = $state(defaultConfig);

	let isConfigOpen = $state(false);
	let activeQuickOption = $derived.by<IntervalSelectOptions | null>(() => {
		for (const option of quickIntervalVariants) {
			const preset = quickIntervalVariantValues[option];
			if (
				preset.length === configOptions.selectedIntervals.length &&
				preset.every((val) => configOptions.selectedIntervals.includes(val))
			) {
				return option;
			}
		}
		return null;
	});

	function handleQuickIntervalOptionClick(option: IntervalSelectOptions) {
		const intervals = quickIntervalVariantValues[option];
		if (!intervals) return;

		configOptions.selectedIntervals = intervals;
	}

	function onModalFinished() {
		isConfigOpen = false;
	}

	function onStartClick() {
		const snapshotConfig = $state.snapshot(configOptions);

		goto("/exercises/interval-ear-training/play", {
			state: {
				config: snapshotConfig
			}
		});
	}
</script>

<svelte:head>
	<title>{exerciseAppData.name} | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Exercises" fallbackHref="/exercises" useHistory={false} />

		<MainExerciseCard {exerciseAppData}>
			<div class="link-buttons flex-row space-above-xlg">
				<Button element="a" variant="outlined" href="/exercises/interval-ear-training/guided">
					<Icon icon="book" color="var(--color-bg-addon-green)" />
					Guided Mode
				</Button>
				<Button element="a" variant="outlined" href="/exercises/interval-ear-training/stats">
					<Icon icon="leaderBoard" color="var(--color-bg-addon-green)" />
					Stats
				</Button>
			</div>

			<hr class="space-above-base" />

			<div class="intervals-input flex-col space-above-lg">
				<p class="text-caption">Intervals</p>
				<div class="flex-row lay-flex-wrap">
					{#each quickIntervalVariants as option}
						<Button
							variant="outlined"
							onclick={() => handleQuickIntervalOptionClick(option)}
							active={activeQuickOption === option}>{option}</Button
						>
					{/each}
				</div>
				<div class="intervals-container flex-row lay-flex-wrap space-above-xsm">
					{#each configOptions.selectedIntervals as interval}
						<span>{interval}</span>
					{/each}
				</div>
			</div>

			<div class="main-buttons flex-row space-above-xlg">
				<Button size="large" onclick={onStartClick}>Start Exercise</Button>
				<Button size="large" variant="secondary" onclick={() => (isConfigOpen = true)}
					>Configure</Button
				>
			</div>
		</MainExerciseCard>
	</main>
</Wrapper>

<Modal bind:isOpen={isConfigOpen}>
	<ConfigModalCard bind:configData={configOptions} onComplete={onModalFinished} />
</Modal>

<style>
	.link-buttons {
		justify-content: end;
	}

	.intervals-container {
		overflow: hidden;
	}

	.intervals-container > span {
		font-size: var(--font-size-12);
		color: var(--color-on-bg-surface-subtle);
	}

	.intervals-container > span:not(:first-child)::before {
		content: "|";
		margin-right: var(--space-8);
	}
</style>
