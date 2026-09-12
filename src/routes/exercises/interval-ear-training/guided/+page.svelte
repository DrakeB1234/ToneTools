<script lang="ts">
  import { goto } from "$app/navigation";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { earTrainingGuideEntry } from "../intervalEarTrainingHelpers";

  function handleEarEntryClick(index: number) {
    const guideEntry = earTrainingGuideEntry[index];

    goto("/exercises/interval-ear-training/play", {
      state: {
        config: guideEntry.exerciseConfig,
      },
    });
  }
</script>

<svelte:head>
  <title>Guided Intervals Ear Training | Tone Tools</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer
      headerText="Guided Intervals"
      fallbackHref="/exercises/interval-ear-training"
    />

    <section class="card">
      <div class="title">
        <h2 class="text-body">Melodic Path</h2>
      </div>
      <div class="flex-col lay-gap-none space-above-sm">
        {#each earTrainingGuideEntry as entry, i}
          <Button
            element="button"
            variant="text"
            onclick={() => handleEarEntryClick(i)}
            class="lay-justify-start"
          >
            <div class="flex-row entry-container">
              <div class="entry-number-badge">
                <p>{i + 1}</p>
              </div>
              <div class="entry-content-container">
                <p class="text-heading-2">{entry.title}</p>
                <p class="text-caption-subtle space-above-sm">
                  {entry.description}
                </p>
                <div
                  class="entry-pills-container flex-row lay-gap-xsm lay-flex-wrap space-above-base"
                >
                  {#each entry.exerciseConfig.selectedIntervals as intervalObj}
                    <div class="pill">{intervalObj.interval}</div>
                  {/each}
                </div>
              </div>
            </div>
          </Button>
          {#if i < earTrainingGuideEntry.length - 1}
            <hr />
          {/if}
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

  .card {
    padding: 0;
  }

  .title {
    padding: var(--space-16);
  }

  .entry-container {
    align-items: start;
    gap: var(--space-16);
    padding: var(--space-12) var(--space-8);
  }

  .entry-number-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 30px;
    height: 30px;
    padding: var(--space-8);

    background-color: var(--color-bg-primary);
    border-radius: var(--radius-full);

    & p {
      color: var(--color-on-bg-primary);
    }
  }

  .entry-content-container {
    flex: 1;
    text-align: start;
  }
</style>
