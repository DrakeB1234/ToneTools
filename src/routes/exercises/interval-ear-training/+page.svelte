<script lang="ts">
  import { goto } from "$app/navigation";
  import MaterialIcon from "$lib/components/Icons/MaterialIcon.svelte";
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
  import Popup from "$lib/components/Popups/Popup.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { intervalObjs } from "$lib/helpers/musicTheoryConstants";
  import type { IntervalEntry } from "$lib/helpers/musicTheoryTypes";
  import ConfigPopupCard from "./ConfigPopupCard.svelte";
  import { defaultConfig } from "./intervalEarTrainingHelpers";

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

  function onPopupFinished() {
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

<Wrapper>
  <main>
    <PageHeaderDetails
      subText="Exercises"
      headerText="Intervals Ear Training"
      href="/"
    />

    <section class="card-base links-card">
      <InteractiveElement
        variant="text"
        href="/exercises/interval-ear-training/guided"
      >
        <div class="link-container">
          <div class="icon-container purple">
            <MaterialIcon name="book" />
          </div>
          <div class="text-container">
            <h2 class="text-base">Guided</h2>
            <p class="caption">
              Learn intervals through a guided set of exercises.
            </p>
          </div>
        </div>
      </InteractiveElement>
      <InteractiveElement
        variant="text"
        href="/exercises/interval-ear-training/guided"
      >
        <div class="link-container">
          <div class="icon-container violet">
            <MaterialIcon name="stacks" />
          </div>
          <div class="text-container">
            <h2 class="text-base">Presets</h2>
            <p class="caption">
              Create or choose your own presets for exercises.
            </p>
          </div>
        </div>
      </InteractiveElement>
      <InteractiveElement
        variant="text"
        href="/exercises/interval-ear-training/guided"
      >
        <div class="link-container">
          <div class="icon-container green">
            <MaterialIcon name="leaderBoard" />
          </div>
          <div class="text-container">
            <h2 class="text-base">Stats</h2>
            <p class="caption">
              See how well you can identify each type of interval
            </p>
          </div>
        </div>
      </InteractiveElement>
    </section>

    <section class="card-base intervals-card">
      <div class="start-container">
        <Button color="brand" size="large" onclick={onStartClick}
          >Start Exercise</Button
        >
        <Button
          color="surface"
          variant="outline"
          size="large"
          onclick={() => (isConfigOpen = true)}
        >
          Configure
        </Button>
      </div>

      <p>Select Intervals</p>
      <div class="interval-buttons-container">
        {#each intervalObjs as interval (interval.interval)}
          <InteractiveElement
            element="button"
            variant="outline"
            activeStyle="active-style-2"
            active={activeIntervalStrings.includes(interval.interval)}
            onclick={() => handleIntervalButtonClick(interval)}
          >
            <div class="interval-button-content">
              <p class="interval-text">{interval.interval}</p>
              <p>{interval.name}</p>
            </div>
          </InteractiveElement>
        {/each}
      </div>
    </section>
  </main>
</Wrapper>

<Popup bind:isOpen={isConfigOpen}>
  <ConfigPopupCard
    bind:configData={configOptions}
    onComplete={onPopupFinished}
  />
</Popup>

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
    grid-template-columns: 1fr 1fr 1fr;
    align-items: stretch;
    grid-auto-rows: 1fr;
    gap: var(--space-16) var(--space-4);

    padding: 0;
  }
  .link-container {
    flex: 1;
    display: grid;
    place-items: center;

    padding: var(--space-16);
  }
  .text-container {
    margin-top: var(--space-8);
    text-align: center;
  }

  .intervals-card {
    display: grid;
    gap: var(--space-4);
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
  .interval-button-content {
    display: flex;
    gap: var(--space-12);

    padding: var(--space-12) var(--space-8);
  }
  .interval-text {
    text-align: right;
    min-width: 3ch;
  }
</style>
