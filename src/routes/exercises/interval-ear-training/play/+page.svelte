<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onMount } from "svelte";
  import type { IntervalEarConfig } from "../intervalEarTrainingHelpers";
  import PlayIntervalEarTraining from "../PlayIntervalEarTraining.svelte";

  const { config } = page.state as {
    config?: IntervalEarConfig;
  };

  let hasPreviousPage = $state(false);

  function handleExit() {
    if (hasPreviousPage) {
      history.back();
    } else {
      goto("/exercises/interval-ear-training");
    }
  }

  afterNavigate(({ from }) => {
    if (from) {
      hasPreviousPage = true;
    }
  });

  // Ensures that navigate methods are called on client side, and not SSR (server)
  onMount(() => {
    if (!config) {
      goto("/exercises/interval-ear-training");
    }
  });
</script>

<svelte:head>
  <title>Intervals Ear Training | Tone Tools</title>
</svelte:head>

<Wrapper>
  {#if config}
    <PlayIntervalEarTraining {config} {handleExit} />
  {/if}
</Wrapper>
