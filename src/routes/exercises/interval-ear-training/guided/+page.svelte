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

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Guide"
      headerText="Intervals Ear Training"
      fallbackHref="/exercises/interval-ear-training"
    />

    <section class="card-base ear-card">
      <div class="title-container">
        <h2>Melodic Path</h2>
      </div>
      <div class="content-container">
        {#each earTrainingGuideEntry as entry, i}
          <InteractiveElement
            element="button"
            variant="text"
            onclick={() => handleEarEntryClick(i)}
          >
            <div class="entry-container">
              <div class="entry-number-badge">
                <p>{i + 1}</p>
              </div>
              <div class="entry-content-container">
                <h3 class="entry-title text-heading-2">{entry.title}</h3>
                <div class="entry-pills-container">
                  {#each entry.exerciseConfig.selectedIntervals as intervalObj}
                    <div class="entry-pill">{intervalObj.interval}</div>
                  {/each}
                </div>
                <p class="entry-description">{entry.description}</p>
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

  .content-container {
    display: grid;
    gap: var(--space-4);

    padding-top: var(--space-8);
  }

  .entry-container {
    display: flex;
    gap: var(--space-12);

    padding: var(--space-16);
  }

  .entry-number-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;

    padding: var(--space-8);

    background-color: var(--color-bg-brand);
    border-radius: var(--radius-full);

    & p {
      color: var(--color-text-inverse);
    }
  }

  .entry-title {
    text-align: start;
  }

  .entry-pills-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);

    margin-top: var(--space-4);
  }

  .entry-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 20px;
    height: 20px;
    padding: var(--space-4);

    border-radius: var(--radius-4);
    font-size: var(--font-size-12);
    background-color: var(--color-bg-surface-dark);
    color: var(--color-text-muted);
  }

  .entry-description {
    margin-top: var(--space-4);
    text-align: start;
  }
</style>
