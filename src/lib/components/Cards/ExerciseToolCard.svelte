<script>
	import Icon from "../Icons/Icon.svelte";

	let {
		title = "Title",
		description = "Description of the card.",
		href = "/",
		color = "",
		icon
	} = $props();
</script>

<a class="tool-link" {href}>
	<div class="tool-link__icon-container" style="background-color: var(--color-bg-addon-{color});">
		<Icon {icon} />
	</div>
	<div class="tool-link__content">
		<h3>{title}</h3>
		<p class="text-caption-subtle text-box-width-sm text-line-clamp-3 space-above-xsm">
			{description}
		</p>
	</div>
</a>

<style>
	.tool-link {
		display: grid;
		grid-template-columns: auto 1fr;

		border-radius: var(--radius-base);
		background-color: var(--color-bg-surface-1);
		border: 1px solid var(--color-border-subtle);
		box-shadow: var(--shadow-1);
		overflow: hidden;
	}

	.tool-link:hover {
		background-color: var(--color-bg-surface-1-active);
	}

	.tool-link__icon-container {
		display: flex;
		justify-content: center;
		color: white;
		padding: var(--space-16) 6px;
	}

	.tool-link__content {
		align-items: start;
		padding: var(--space-16) var(--space-12);
		padding-bottom: var(--space-24);
	}
</style>
