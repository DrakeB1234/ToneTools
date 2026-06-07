<script lang="ts">
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import RootNoteInput from "$lib/components/RootNoteInput.svelte";
  import Button from "$lib/components/UI/Button.svelte";
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

    <section class="card-base input-card">
      <RootNoteInput bind:value={inputNote} />

      <div class="scales-container">
        {#each scales as scale (scale)}
          <Button
            element="a"
            color="surface"
            variant="outline"
            size="large"
            href={encodeUrlScale(inputNote, scale)}
          >
            <div class="scales-item">
              <h2 class="text-heading-3">{inputNote}&nbsp;{scale}</h2>
              <p class="text-caption-muted">{scale}</p>
            </div>
          </Button>
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

  .input-card {
    padding-block: var(--space-16);
  }

  .scales-container {
    display: grid;
    gap: var(--space-8);

    margin-top: var(--space-24);
  }

  .scales-item {
    display: grid;
    gap: var(--space-4);
  }
</style>
