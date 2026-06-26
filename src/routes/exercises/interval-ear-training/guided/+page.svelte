<script lang="ts">
  import { goto } from "$app/navigation";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
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
  <title>Guided Intervals Ear Training | Music App</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Guide"
      headerText="Intervals Ear Training"
      fallbackHref="/exercises/interval-ear-training"
    />

    <section class="card ear-card">
      <div class="title-container">
        <h2>Melodic Path</h2>
      </div>
      <div class="content-container lay-col space-above-small">
        {#each earTrainingGuideEntry as entry, i}
          <InteractiveElement
            element="button"
            variant="text"
            onclick={() => handleEarEntryClick(i)}
          >
            <div class="lay-row entry-container">
              <div class="entry-number-badge">
                <p>{i + 1}</p>
              </div>
              <div class="entry-content-container">
                <h3 class="text-heading-2">{entry.title}</h3>
                <div class="entry-pills-container lay-row space-above-xsmall">
                  {#each entry.exerciseConfig.selectedIntervals as intervalObj}
                    <div class="pill">{intervalObj.interval}</div>
                  {/each}
                </div>
                <p class="space-above-xsmall">{entry.description}</p>
              </div>
            </div>
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

  .content-container {
    padding: var(--space-8);
  }

  .ear-card {
    display: grid;
    gap: var(--space-4);

    padding: var(--space-12) 0;
  }

  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 var(--space-16);
  }

  .entry-container {
    align-items: start;
    gap: var(--space-12);
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

  .entry-pills-container {
    flex-wrap: wrap;
    gap: var(--space-4);
  }
</style>
