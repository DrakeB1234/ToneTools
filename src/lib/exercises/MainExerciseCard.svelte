<script lang="ts">
	import type { Snippet } from "svelte";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import type { exercisesData } from "$lib/data/appData";

	type ExerciseItem = (typeof exercisesData)[number];

	type Props = {
		exerciseAppData: ExerciseItem;
		children: Snippet;
	};

	let { exerciseAppData, children }: Props = $props();
</script>

<div class="card card--exercise space-above-sm">
	<div class="top-container">
		<div class="flex-row">
			<div class="icon-container icon-container--small green">
				<Icon icon={exerciseAppData.icon} />
			</div>
			<h2>{exerciseAppData.name}</h2>
		</div>
		<p class="text-body-subtle space-above-sm">{exerciseAppData.description}</p>
	</div>

	{@render children()}
</div>

<style>
	.top-container {
		align-items: start;
		gap: var(--space-16);
		margin-top: var(--space-8);
	}
</style>
