<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onMount } from "svelte";
  import type { IntervalEarConfig } from "../intervalEarTrainingHelpers";
  import PlayIntervalEarTraining from "../PlayIntervalEarTraining.svelte";

  const { config } = page.state as {
    config?: IntervalEarConfig;
  };

  function handleExit() {
    history.back();
  }

  // Ensures that navigate methods are called on client side, and not SSR (server)
  onMount(() => {
    if (!config) {
      goto("/exercises/interval-ear-training");
    }
  });
</script>

<Wrapper>
  {#if config}
    <PlayIntervalEarTraining {config} {handleExit} />
  {/if}
</Wrapper>
