<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Modal from "$lib/components/Modal/Modal.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { intervalObjs } from "$lib/helpers/musicTheoryConstants";
  import type { IntervalEntry } from "$lib/helpers/musicTheoryTypes";
  import { defaultConfig } from "./intervalEarTrainingHelpers";
  import ConfigModalCard from "./ConfigModalCard.svelte";

  let configOptions = $state(defaultConfig);
  let activeIntervalStrings: string[] = $derived(
    configOptions.selectedIntervals.map((e) => e.interval),
  );

  let isConfigOpen = $state(false);

  function handleIntervalButtonClick(interval: IntervalEntry) {
    const isAlreadySelected = configOptions.selectedIntervals.some(
      (i) => i.interval === interval.interval,
    );

    if (isAlreadySelected) {
      configOptions.selectedIntervals = configOptions.selectedIntervals.filter(
        (i) => i.interval !== interval.interval,
      );
    } else {
      configOptions.selectedIntervals = [
        ...configOptions.selectedIntervals,
        interval,
      ];
    }
  }

  function onModalFinished() {
    isConfigOpen = false;
  }

  function onStartClick() {
    const snapshotConfig = $state.snapshot(configOptions);

    goto("/exercises/interval-ear-training/play", {
      state: {
        config: snapshotConfig,
      },
    });
  }
</script>

<svelte:head>
  <title>Intervals Ear Training | Music App</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Exercises"
      headerText="Intervals Ear Training"
      fallbackHref="/"
      useHistory={false}
    />

    <section class="card links-card">
      <InteractiveElement
        variant="text"
        href="/exercises/interval-ear-training/guided"
        style="padding: var(--space-12); padding-bottom: var(--space-16);"
      >
        <div class="lay-grid-center link-container">
          <div class="icon-container purple">
            <Icon icon="book" />
          </div>
          <div class="text-container">
            <h2 class="text-heading-3">Guided</h2>
            <p class="text-caption-muted">
              Learn intervals through a guided set of exercises.
            </p>
          </div>
        </div>
      </InteractiveElement>
      <InteractiveElement
        variant="text"
        href="/exercises/interval-ear-training/guided"
        style="padding: var(--space-12); padding-bottom: var(--space-16);"
      >
        <div class="lay-grid-center link-container">
          <div class="icon-container green">
            <Icon icon="leaderBoard" />
          </div>
          <div class="text-container">
            <h2 class="text-heading-3">Stats</h2>
            <p class="text-caption-muted">
              See how well you can identify each type of interval
            </p>
          </div>
        </div>
      </InteractiveElement>
    </section>

    <section class="card">
      <div class="start-container">
        <Button onclick={onStartClick}>Start Exercise</Button>
        <Button variant="secondary" onclick={() => (isConfigOpen = true)}>
          Configure
        </Button>
      </div>

      <p>Select Intervals</p>
      <div class="interval-buttons-container">
        {#each intervalObjs as interval (interval.interval)}
          <InteractiveElement
            variant="outlined"
            state={activeIntervalStrings.includes(interval.interval)
              ? "on"
              : "off"}
            onclick={() => handleIntervalButtonClick(interval)}
          >
            <div class="lay-row">
              <p class="interval-text">{interval.interval}</p>
              <p>{interval.name}</p>
            </div>
          </InteractiveElement>
        {/each}
      </div>
    </section>
  </main>
</Wrapper>

<Modal bind:isOpen={isConfigOpen}>
  <ConfigModalCard
    bind:configData={configOptions}
    onComplete={onModalFinished}
  />
</Modal>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);

    width: 100%;
    padding: var(--app-padding);
  }

  .links-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    grid-auto-rows: 1fr;
    gap: var(--space-16) var(--space-4);

    padding: 0;
  }
  .link-container {
    flex: 1;
  }
  .text-container {
    margin-top: var(--space-8);
    text-align: center;
  }

  .start-container {
    display: flex;
    gap: var(--space-8);

    padding: var(--space-12) 0;
    margin-bottom: var(--space-16);
  }

  .interval-buttons-container {
    display: grid;
    gap: var(--space-4);
  }
  .interval-text {
    text-align: right;
    min-width: 3ch;
  }
</style>
