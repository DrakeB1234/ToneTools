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
  <title>Intervals Ear Training | Tone Tools</title>
</svelte:head>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Exercises"
      headerText="Intervals Ear Training"
      fallbackHref="/"
      useHistory={false}
    />

    <section class="top-card card">
      <Button
        element="a"
        variant="text"
        href="/exercises/interval-ear-training/guided"
        fullWidth
        style="justify-content: start;"
      >
        <div class="top-card__link lay-row lay-gap-16">
          <div class="icon-container purple">
            <Icon icon="book" />
          </div>
          <div class="lay-col lay-gap-0">
            <p class="text-heading-3">Guided</p>
            <p class="text-caption-muted">
              Learn intervals through a guided set of exercises.
            </p>
          </div>
        </div>
      </Button>
      <hr />
      <Button
        element="a"
        variant="text"
        href="/exercises/interval-ear-training/stats"
        fullWidth
        style="justify-content: start;"
      >
        <div class="top-card__link lay-row lay-gap-16">
          <div class="icon-container green">
            <Icon icon="leaderBoard" />
          </div>
          <div class="lay-col lay-gap-0">
            <p class="text-heading-3">Stats</p>
            <p class="text-caption-muted">
              Check out how well you can indentify each interval.
            </p>
          </div>
        </div>
      </Button>
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
  .top-card {
    padding: 0;
    overflow: hidden;
  }
  .top-card__link {
    padding: var(--space-8);
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
