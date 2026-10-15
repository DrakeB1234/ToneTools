<script lang="ts">
	import { goto } from "$app/navigation";
	import Icon from "$lib/components/Icons/Icon.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { presets } from "$lib/exercises/sight-reading/config";
	import { getFullNoteNameFromObj } from "$lib/helpers/musicTheory";

	function handlePresetClick(idx: number) {
		const presetObj = presets[idx];
		if (!presetObj) return;

		goto("/exercises/sight-reading/play", {
			state: {
				config: presetObj.config
			}
		});
	}
</script>

<Wrapper>
	<main class="page">
		<PageHeaderContainer
			headerText="Presets Sight Reading"
			fallbackHref="/exercises/sight-reading"
			useHistory={false}
		/>

		<section class="card card--exercise space-above-sm">
			<div class="title">
				<h2 class="text-body">Beginner</h2>
			</div>
			{#each presets as preset, i (preset.name)}
				<Button
					variant="text"
					fullWidth
					class="lay-justify-start"
					onclick={() => handlePresetClick(i)}
					aria-label="Go to exercise: {preset.name}"
				>
					<div class="preset-link flex-col lay-gap-none">
						<p class="text-heading-2">{preset.name}</p>
						<p class="text-caption-subtle space-above-sm text-max-width-base">
							{preset.description}
						</p>
						<div class="preset-link__pills flex-row lay-flex-wrap lay-gap-xsm space-above-base">
							<p class="pill flex-row lay-gap-xsm">
								<Icon icon="musicNote" size="small" />
								{getFullNoteNameFromObj(preset.config.noteRange.low)} - {getFullNoteNameFromObj(
									preset.config.noteRange.high
								)}
							</p>
							<p class="pill flex-row lay-gap-xsm">
								<Icon icon="timer" size="small" />
								{preset.config.timer}
							</p>
						</div>
					</div>
				</Button>
				{#if i < presets.length - 1}
					<hr />
				{/if}
			{/each}
		</section>
	</main>
</Wrapper>

<style>
	.card {
		padding: 0;
	}
	.title {
		padding: var(--space-16);
	}
	.preset-link {
		text-align: left;
		padding: var(--space-12) var(--space-8);
	}
</style>
