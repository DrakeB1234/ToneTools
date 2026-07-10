<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onMount } from "svelte";
  import type { ConfigOptions } from "../helpers";
  import PlaySightReading from "../PlaySightReading.svelte";

  const { config } = page.state as {
    config?: ConfigOptions;
  };

  let hasPreviousPage = $state(false);

  function handleExit() {
    if (hasPreviousPage) {
      history.back();
    } else {
      goto("/exercises/sight-reading");
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
      goto("/exercises/sight-reading");
    }
  });
</script>

<svelte:head>
  <title>Sight Reading | Tone Tools</title>
</svelte:head>

<Wrapper>
  {#if config}
    <PlaySightReading {config} {handleExit} />
  {/if}
</Wrapper>
