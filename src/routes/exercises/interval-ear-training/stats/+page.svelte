<script lang="ts">
	import ConfirmationModalCard from "$lib/components/Modal/ConfirmationModalCard.svelte";
	import Modal from "$lib/components/Modal/Modal.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Select from "$lib/components/UI/Select.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import {
		intervalStatsService,
		sortStatVariants,
		type SortStatVariants
	} from "$lib/data/db/intervalStatsService.svelte";

	let dashboardState = $derived(intervalStatsService.dashboard);
	let isModalOpen = $state(false);
	let sortSelectOption: SortStatVariants = $state("intervals");

	let sortedStats = $derived(
		dashboardState.status === "success"
			? intervalStatsService.sortStatsArray(dashboardState.statsArray, sortSelectOption)
			: []
	);

	const sortSelectOptions = sortStatVariants.map((variant) => {
		let label = "";
		switch (variant) {
			case "intervals": {
				label = "Intervals";
				break;
			}
			case "accuracy-asc": {
				label = "Accuracy Asc";
				break;
			}
			case "accuracy-desc": {
				label = "Accuracy Desc";
				break;
			}
			case "most-played": {
				label = "Most Played";
				break;
			}
		}

		return {
			label,
			value: variant
		};
	});

	function handleResetDataPressed() {
		isModalOpen = true;
	}

	function handleResetModalResponse(confirmed: boolean) {
		if (confirmed) {
			intervalStatsService.resetAll();
		}
		isModalOpen = false;
	}
</script>

<svelte:head>
	<title>Stats Intervals Ear Training | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer
			headerText="Interval Stats"
			fallbackHref="/exercises/interval-ear-training"
		/>

		{#if dashboardState.status === "empty"}
			<div class="card card--exercise empty-card grid-center lay-gap-none space-above-sm">
				<p>No interval stats available yet.</p>
				<p>Start practicing to see your progress here.</p>
			</div>
		{:else}
			<div class="card card--exercise space-above-sm">
				<div class="overview">
					<div class="overview__item">
						<p class="text-heading-1">{dashboardState.overallAccuracy}%</p>
						<p>Overall Accuracy</p>
					</div>
					<div class="overview__item">
						<p class="text-heading-1">
							{#if dashboardState.strongestInterval}
								{dashboardState.strongestInterval.interval}
								<span class="text-body">({dashboardState.strongestInterval.correctPercent}%)</span>
							{:else}
								-
							{/if}
						</p>
						<p>Strongest</p>
					</div>
					<div class="overview__item">
						<p class="text-heading-1">
							{#if dashboardState.weakestInterval}
								{dashboardState.weakestInterval.interval}
								<span class="text-body">({dashboardState.weakestInterval.correctPercent}%)</span>
							{:else}
								-
							{/if}
						</p>
						<p>Weakest</p>
					</div>
				</div>
			</div>

			<div class="interval-card panel space-above-base">
				<div class="interval-card__top flex-row lay-space-between">
					<p>Stats</p>
					<div class="flex-row">
						<p class="text-caption">Sort by</p>
						<Select
							style="width: fit-content;"
							bind:value={sortSelectOption}
							options={sortSelectOptions}
						/>
					</div>
				</div>
				{#each sortedStats as stat}
					<div class="interval flex-row space-above-sm">
						<div class="interval__name flex-col">
							<p class="text-heading-3">{stat.interval}</p>
							<p class="text-caption-subtle">{stat.name}</p>
						</div>
						<div class="interval__progress">
							<div
								class="custom-progress"
								role="progressbar"
								aria-valuenow={stat.correctPercent}
								aria-valuemin="0"
								aria-valuemax="100"
							>
								<div class="custom-progress-fill" style="width: {stat.correctPercent}%;"></div>
							</div>
						</div>
						<div class="interval__amount flex-col lay-gap-none">
							<p class="text-caption-subtle">Correct</p>
							<span class="text-heading-3">{stat.correct} / {stat.correct + stat.wrong}</span>
						</div>
					</div>
				{/each}
			</div>

			<div class="reset-stats flex-row space-above-base">
				<Button variant="destructive" onclick={handleResetDataPressed}>Reset</Button>
			</div>
		{/if}
	</main>
</Wrapper>

<Modal isOpen={isModalOpen}>
	<ConfirmationModalCard
		title="Reset Stats"
		message="Are you sure you want to reset ALL of your stats data? This action is irreversible."
		confirmationText="Reset"
		onResponse={handleResetModalResponse}
	/>
</Modal>

<style>
	.empty-card {
		height: 7em;
	}

	.overview {
		display: grid;
		grid-template-columns: 14em repeat(auto-fit, minmax(200px, 1fr));
		place-items: end center;
		row-gap: var(--space-24);
		padding: var(--space-8);
	}

	.overview__item {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		text-align: center;
	}

	.reset-stats {
		justify-content: end;
	}

	.interval-card {
		padding: 0;
	}

	.interval {
		gap: 0;
		padding: var(--space-16) var(--space-24);
	}

	.interval-card__top {
		padding: var(--space-12);
	}

	.interval:not(:last-child) {
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.interval__name {
		flex: 1;
		gap: 0;
	}

	.interval__progress {
		flex: 2;
		margin-inline: var(--space-24);
	}

	.custom-progress {
		width: 100%;
		max-width: 350px;
		height: 8px;
		background-color: var(--color-bg-surface-2);
		border-radius: var(--radius-full, 99px);
		overflow: hidden;
	}

	.custom-progress-fill {
		height: 100%;
		background-color: var(--color-bg-addon-green);
	}

	.interval__amount {
		text-align: right;
	}

	@media (max-width: 768px) {
		.overview {
			padding-inline: 0;
			grid-template-columns: 8em repeat(auto-fit, minmax(80px, 1fr));
		}

		.interval {
			padding: var(--space-12);
		}
	}
</style>
