<script>
	import Icon from "$lib/components/Icons/Icon.svelte";
	import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
	import Button from "$lib/components/UI/Button.svelte";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { exercisesData } from "$lib/data/appData";
</script>

<svelte:head>
	<title>Exercises | Tone Tools</title>
</svelte:head>

<Wrapper>
	<main class="page">
		<PageHeaderContainer headerText="Exercises" fallbackHref="/" useHistory={false} />

		<section class="card flex-col lay-gap-none space-above-sm">
			{#each exercisesData as data, i (data.urlName)}
				<Button element="a" variant="text" class="btn--row" href={data.href} fullWidth>
					<div class="flex-row lay-gap-base">
						<div class="icon-container {data.color}">
							<Icon icon={data.icon} />
						</div>
						<div class="item-button__text flex-col lay-gap-xsm">
							<p class="text-heading-3">{data.name}</p>
							<p class="text-caption-subtle">{data.description}</p>
						</div>
					</div>
				</Button>
				{#if i < exercisesData.length - 1}
					<hr />
				{/if}
			{/each}
		</section>
	</main>
</Wrapper>

<style>
	.card {
		padding: 0;
		overflow: hidden;
	}
</style>
