<script lang="ts">
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
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
    <PageHeaderDetails subText="Tools" headerText="Scales Library" href="/" />

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
              <h2 class="text-base">{inputNote}&nbsp;{scale}</h2>
              <p class="caption muted">{scale}</p>
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

  .scales-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    gap: var(--space-8);

    margin-top: var(--space-24);
  }

  .scales-item {
    display: grid;
    gap: var(--space-4);
  }

  @media (max-width: 768px) {
    .scales-container {
      grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    }
  }
</style>
