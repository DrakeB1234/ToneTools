<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

	type Variant =
		| "primary"
		| "secondary"
		| "destructive"
		| "destructive-outlined"
		| "outlined"
		| "text"
		| "unstyled"
		| "card";
	type Size = "small" | "base" | "large";
	type Shape = "default" | "circle" | "pill";

	type BaseProps = {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		icon?: boolean;
		fullWidth?: boolean;
		active?: boolean;
		class?: string;
		children?: Snippet;
	};

	type Props =
		| (BaseProps & { element?: "button" } & Omit<
					HTMLButtonAttributes,
					"class" | "children" | "active"
				>)
		| (BaseProps & { element: "a" } & Omit<
					HTMLAnchorAttributes,
					"class" | "children" | "type" | "active"
				>);

	let {
		element = "button",
		variant = "primary",
		size = "base",
		shape = "default",
		icon = false,
		fullWidth = false,
		active,
		class: className = "",
		children,
		...rest
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let buttonClass = [
		"btn",
		`btn--${variant}`,
		`btn--size-${size}`,
		shape !== "default" && `btn--shape-${shape}`,
		icon && "btn--icon",
		fullWidth && "btn--full-width",
		className
	]
		.filter(Boolean)
		.join(" ");
</script>

<svelte:element this={element} data-active={active ? "on" : "off"} class={buttonClass} {...rest}>
	{@render children?.()}
</svelte:element>
