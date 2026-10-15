<script>
	import Icon from "./Icons/Icon.svelte";

	let { href, icon, color, name } = $props();
</script>

<a class="last-used-link" {href}>
	<div class="last-used-link__icon" style="background-color: var(--color-bg-addon-{color});">
		<Icon {icon} />
	</div>
	<span>{name}</span>
</a>

<style>
	.last-used-link {
		display: flex;
		align-items: center;
		min-width: fit-content;
		height: 3.5em;

		background-color: var(--color-bg-surface-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-base);
		box-shadow: var(--shadow-1);
		overflow: hidden;
		scroll-snap-align: start;
	}
	.last-used-link:hover {
		background-color: var(--color-bg-surface-1-active);
	}

	.last-used-link > span {
		white-space: nowrap;
		padding-inline: var(--space-16);
	}

	.last-used-link__icon {
		display: grid;
		place-items: center;
		height: 100%;
		padding-inline: var(--space-8);

		color: white;
	}
</style>
