<script>
	import ExerciseToolCard from "$lib/components/Cards/ExerciseToolCard.svelte";
	import HeroCard from "$lib/components/Cards/HeroCard.svelte";
	import ToolCard from "$lib/components/Cards/ToolCard.svelte";
	import RecentlyUsedLink from "$lib/components/RecentlyUsedLink.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { exercisesData, toolsData } from "$lib/data/appData";
	import { lastUsedService } from "$lib/data/lastUsedService.svelte";

	const allItems = [...exercisesData, ...toolsData];

	const recentlyUsedItems = $derived(
		lastUsedService.lastUsedIdsList
			.map((e) => allItems.find((item) => item.href === e))
			.filter((item) => item !== undefined)
	);
</script>

<svelte:head>
	<title>Tone Tools</title>
</svelte:head>

<HeroCard />

<Wrapper maxWidth="homepage">
	<main>
		{#if recentlyUsedItems.length > 0}
			<div class="content space-above-sm">
				<p class="text-heading-3">Recently Used</p>

				<div class="recently-used flex-row space-above-base">
					{#each recentlyUsedItems as item}
						<RecentlyUsedLink
							href={item.href}
							icon={item.icon}
							color={item.color}
							name={item.name}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<div class="content">
			<p class="text-heading-3">Exercises</p>

			<div class="lay-grid-cards space-above-base">
				{#each exercisesData as item}
					<ExerciseToolCard
						title={item.name}
						description={item.description}
						href={item.href}
						color={item.color}
						icon={item.icon}
					/>
				{/each}
			</div>
		</div>

		<div class="content">
			<p class="text-heading-3">Tools</p>

			<div class="lay-grid-cards space-above-base">
				{#each toolsData as item}
					<ExerciseToolCard
						title={item.name}
						description={item.description}
						href={item.href}
						color={item.color}
						icon={item.icon}
					/>
				{/each}
			</div>
		</div>
	</main>
</Wrapper>

<style>
	main {
		width: 100%;
		padding: var(--app-padding);
	}

	.content:not(:first-child) {
		margin-top: var(--space-52);
	}

	.recently-used {
		flex-wrap: wrap;
		gap: var(--space-12);

		padding-bottom: var(--space-8);
		padding-right: var(--space-36);
	}

	.lay-grid-cards {
		display: grid;
		align-items: stretch;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-12);
	}

	@media (max-width: 768px) {
		.lay-grid-cards {
			grid-template-columns: repeat(1, 1fr);
			gap: var(--space-8);
		}

		.recently-used {
			flex-wrap: nowrap;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			mask-image: var(--mask-image-horizontal-fade);
		}
	}
</style>
