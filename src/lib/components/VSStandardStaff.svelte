<script lang="ts">
	import { StandardStaff, type StandardStaffUserOptions } from "vector-score";

	type Props = {
		options?: StandardStaffUserOptions;
		instance?: StandardStaff | null;
	};

	let { options, instance = $bindable(null) }: Props = $props();

	function setupVectorScore(node: HTMLDivElement) {
		const defaultOptions: StandardStaffUserOptions = {
			staffType: "grand",
			...options
		};

		instance = new StandardStaff(node, defaultOptions);

		return {
			destroy() {
				instance?.destroy?.();
				instance = null;
			}
		};
	}
</script>

<div use:setupVectorScore></div>
