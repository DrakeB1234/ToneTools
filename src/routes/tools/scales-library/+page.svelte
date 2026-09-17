<script lang="ts">
  import { page } from "$app/state";
  import NoteInput from "$lib/components/UI/NoteInput.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { lastUsedService } from "$lib/data/lastUsedService.svelte";
  import { encodeUrlScale } from "$lib/helpers/helpers";
  import { getAllModes } from "$lib/helpers/musicTheory";
  import { onMount } from "svelte";

  let scales = getAllModes();
  let inputNote = $state("C");

  onMount(() => {
    // Save url for last used data
    lastUsedService.addLastUsed(page.url.pathname);
  });
</script>

<svelte:head>
  <title>Scales Library | Tone Tools</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer headerText="Scales Library" fallbackHref="/" />

    <section class="card">
      <NoteInput bind:activeNote={inputNote} hideEnharmonics={false} />
    </section>

    <div class="scales-container flex-col space-above-base">
      {#each scales as scale (scale)}
        <Button
          element="a"
          variant="outlined"
          href={encodeUrlScale(inputNote, scale)}
          class="lay-justify-start"
        >
          <div class="scale-button flex-col lay-gap-none">
            <p>{inputNote}&nbsp;{scale}</p>
            <p class="text-body-subtle">{scale}</p>
          </div>
        </Button>
      {/each}
    </div>
  </main>
</Wrapper>

<style>
  main {
    display: grid;
    gap: var(--space-16);

    width: 100%;
    padding: var(--app-padding);
  }

  .scales-container {
    gap: var(--space-12);
  }

  .scale-button {
    align-items: start;
    padding: var(--space-8);
  }
</style>
