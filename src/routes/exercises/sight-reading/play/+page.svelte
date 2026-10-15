<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/state";
	import Wrapper from "$lib/components/Wrapper.svelte";
	import { exercisesData } from "$lib/data/appData";
	import {
		defaultConfig,
		resolveConfig,
		type ConfigOptions
	} from "$lib/exercises/sight-reading/config";
	import PlayExercise from "$lib/exercises/sight-reading/PlayExercise.svelte";

	let exerciseAppData = exercisesData.find((e) => e.href === "/exercises/sight-reading")!;

	const rawConfig = (page.state as { config?: ConfigOptions })?.config;
	const config: ConfigOptions = rawConfig && resolveConfig(rawConfig) ? rawConfig : defaultConfig;

	let hasPreviousPage = $state(false);

	function handleExit() {
		if (hasPreviousPage) {
			history.back();
		} else {
			goto(exerciseAppData.href);
		}
	}

	afterNavigate(({ from }) => {
		if (from) {
			hasPreviousPage = true;
		}
	});
</script>

<svelte:head>
	<title>{exerciseAppData.name} | Tone Tools</title>
</svelte:head>

<Wrapper>
	<PlayExercise {config} {handleExit} />
</Wrapper>
