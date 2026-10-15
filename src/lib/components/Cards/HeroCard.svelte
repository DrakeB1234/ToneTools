<script>
	import DAW from "../Icons/DAW.svelte";
	import Icon from "../Icons/Icon.svelte";
	import Button from "../UI/Button.svelte";
</script>

<div class="card">
	<div class="content flex-row">
		<Icon icon={DAW} color="var(--color-on-bg-primary)" size="large" />
		<div>
			<h1 class="text-heading-2">Chord Progression Creator</h1>
			<p class="text-caption text-max-width-base space-above-sm">
				Experiment with chords and choose between various styles to hear your progression in!
			</p>
			<Button element="a" class="btn--on-primary space-above-lg" href="/tools/chord-progression">
				Open Tool
				<Icon icon="arrowRightAlt" />
			</Button>
		</div>

		<img class="hero-image" width="160" height="auto" src="/logo-standalone.png" alt="" />
	</div>
</div>

<style>
	.card {
		position: relative;
		padding: 2.5em var(--space-16);

		border-radius: 0;
		border: none;
		background: linear-gradient(90deg, rgba(38, 115, 238, 1) 60%, rgb(82, 171, 222) 100%);
		overflow: hidden;
	}

	.content {
		max-width: var(--app-max-width);
		margin: 0 auto;

		align-items: start;
		gap: var(--space-12);
	}

	.card h1,
	.card p {
		color: var(--color-on-bg-primary);
	}

	.hero-image {
		position: absolute;
		right: 0;
		bottom: calc(var(--space-16) * -1);
		height: auto;
		opacity: 0.15;
		transform: rotate(-15deg);
	}
</style>
