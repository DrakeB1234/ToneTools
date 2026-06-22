<script lang="ts">
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import RootNoteInput from "$lib/components/RootNoteInput.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { encodeUrlScale } from "$lib/helpers/helpers";
  import { getAllModes } from "$lib/helpers/musicTheory";

  let scales = getAllModes();
  let inputNote = $state("C");
</script>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Tools"
      headerText="Scales Library"
      fallbackHref="/"
    />

    <section class="card">
      <RootNoteInput bind:value={inputNote} />

      <div class="scales-container lay-col space-above-large">
        {#each scales as scale (scale)}
          <InteractiveElement
            variant="outlined"
            style="padding: var(--space-12)"
            href={encodeUrlScale(inputNote, scale)}
          >
            <p>{inputNote}&nbsp;{scale}</p>
            <p class="text-body-muted">{scale}</p>
          </InteractiveElement>
        {/each}
      </div>
    </section>
  </main>
</Wrapper>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);

    width: 100%;
    padding: var(--app-padding);
  }
</style>
