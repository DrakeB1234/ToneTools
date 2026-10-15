<script lang="ts">
	import { goto } from "$app/navigation";
	import Modal from "$lib/components/Modal/Modal.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import {
		defaultConfig,
		noteRangeVariants,
		staffVariants,
		type ConfigOptions,
		type NoteRangeVariants
	} from "$lib/exercises/sight-reading/config";
	import ConfigModalCard from "$lib/exercises/sight-reading/ConfigModalCard.svelte";
	import { getFullNoteNameFromObj } from "$lib/helpers/musicTheory";
	import { staffNoteRangeMap } from "$lib/exercises/sight-reading/helpers";
	import { exercisesData } from "$lib/data/appData";
	import MainExerciseCard from "$lib/exercises/MainExerciseCard.svelte";

	let exerciseAppData = exercisesData.find((e) => e.href === "/exercises/sight-reading")!;

	let config: ConfigOptions = $state(defaultConfig);
	let isNoteRangeModalOpen = $state(false);

	let rangeStr = $derived.by(() => {
		const staffRangeData = staffNoteRangeMap[config.staff];
		const selectedRangeData = staffRangeData[config.noteRange as NoteRangeVariants];

		return (
			getFullNoteNameFromObj(selectedRangeData.low) +
			" / " +
			getFullNoteNameFromObj(selectedRangeData.high)
		);
	});

	function onStartClick() {
		const snapshotConfig = $state.snapshot(config);

		goto("/exercises/sight-reading/play", {
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
				<Button element="a" variant="outlined" href="/exercises/sight-reading/presets">
					<Icon icon="stacks" color="var(--color-bg-addon-green)" />
					Presets
				</Button>
			</div>

			<hr class="space-above-base" />

			<div class="flex-col space-above-lg">
				<p class="text-caption">Staff</p>
				<div class="flex-row lay-flex-wrap">
					{#each staffVariants as variant}
						<Button
							variant="outlined"
							onclick={() => (config.staff = variant)}
							active={config.staff === variant}
							>{variant}
						</Button>
					{/each}
				</div>
			</div>
			<div class="flex-col space-above-lg">
				<p class="text-caption">
					Note Range <span class="text-caption-subtle">({rangeStr})</span>
				</p>
				<div class="flex-row lay-flex-wrap">
					{#each noteRangeVariants as variant}
						<Button
							variant="outlined"
							onclick={() => (config.noteRange = variant)}
							active={config.noteRange === variant}
							>{variant}
						</Button>
					{/each}
				</div>
			</div>

			<div class="main-buttons flex-row space-above-xlg">
				<Button size="large" onclick={onStartClick}>Start Exercise</Button>
				<Button size="large" variant="secondary" onclick={() => (isNoteRangeModalOpen = true)}
					>Configure</Button
				>
			</div>
		</MainExerciseCard>
	</main>
</Wrapper>

<Modal bind:isOpen={isNoteRangeModalOpen}>
	<ConfigModalCard
		configData={config}
		bind:rangeStr
		onComplete={() => (isNoteRangeModalOpen = false)}
	/>
</Modal>

<style>
	.link-buttons {
		justify-content: end;
	}
</style>
