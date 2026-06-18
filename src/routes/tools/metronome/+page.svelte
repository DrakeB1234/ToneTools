<script lang="ts">
  import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { onDestroy, onMount } from "svelte";

  const MIN_BPM = 40;
  const MAX_BPM = 240;

  let inputBpmAmount = $state(120);
  let inputBeatCount: number = $state(4);
  let inputBeatValueCount: number = $state(4);

  let currentBeatCount: number = $state(0);
  let metrnomeInterval: ReturnType<typeof setInterval> | null = $state(null);

  // Tap Tempo Variables
  let tapTimes: number[] = [];
  const MAX_TAPS = 5;
  const TAP_TIMEOUT = 2000;

  function handleTap() {
    if (metrnomeInterval) {
      stopMetronome();
    }

    const now = performance.now();

    if (
      tapTimes.length > 0 &&
      now - tapTimes[tapTimes.length - 1] > TAP_TIMEOUT
    ) {
      tapTimes = [];
    }

    tapTimes.push(now);

    if (tapTimes.length > MAX_TAPS) {
      tapTimes.shift();
    }

    if (tapTimes.length >= 2) {
      let totalInterval = 0;

      for (let i = 1; i < tapTimes.length; i++) {
        totalInterval += tapTimes[i] - tapTimes[i - 1];
      }

      const averageInterval = totalInterval / (tapTimes.length - 1);

      let calculatedBpm = Math.round(60000 / averageInterval);

      if (calculatedBpm < 40) calculatedBpm = 40;
      if (calculatedBpm > 240) calculatedBpm = 240;

      inputBpmAmount = calculatedBpm;
    }
  }

  function handleBpmButtonPress(amount: number) {
    if (metrnomeInterval) {
      stopMetronome();
    }

    const newBpm = inputBpmAmount + amount;
    if (newBpm < MIN_BPM || newBpm > MAX_BPM) {
      return;
    }

    inputBpmAmount += amount;

    handleInputChange();
  }

  function handlePlayPressed() {
    if (metrnomeInterval) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }

  function handleInputChange() {
    if (metrnomeInterval) {
      startMetronome();
    }
  }

  function startMetronome() {
    if (metrnomeInterval) {
      stopMetronome();
    }

    const beatDurationMultiplier = 4 / inputBeatValueCount;
    const intervalTime = (60 / inputBpmAmount) * 1000 * beatDurationMultiplier;

    // Start with sound immediately
    currentBeatCount = 1;
    sfxAudioService.play("clickUp");

    metrnomeInterval = setInterval(() => {
      currentBeatCount++;

      if (currentBeatCount > inputBeatCount) currentBeatCount = 1;

      if (currentBeatCount === 1) {
        sfxAudioService.play("clickUp");
      } else {
        sfxAudioService.play("clickDown");
      }
    }, intervalTime);
  }

  function stopMetronome() {
    if (metrnomeInterval) {
      clearInterval(metrnomeInterval);
    }

    metrnomeInterval = null;
    currentBeatCount = 0;

    sfxAudioService.stopAll();
  }

  onMount(() => {
    sfxAudioService.init();
  });

  onDestroy(() => {
    stopMetronome();
    sfxAudioService.stopAll();
  });
</script>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Tools"
      headerText="Metronome"
      fallbackHref="/"
    />

    <section class="card-base">
      <div class="bpm-container">
        <h2 class="ui-xlarge">{inputBpmAmount}</h2>
        <p>BPM</p>
      </div>

      <div class="input-container">
        <Button
          color="surface"
          variant="text"
          shape="small"
          onclick={() => handleBpmButtonPress(-1)}><Icon icon="minus" /></Button
        >
        <input
          type="range"
          min="40"
          max="240"
          onchange={handleInputChange}
          bind:value={inputBpmAmount}
          class="slider"
        />
        <Button
          color="surface"
          variant="text"
          shape="small"
          onclick={() => handleBpmButtonPress(1)}><Icon icon="plus" /></Button
        >
      </div>

      <div class="play-input-container">
        <button class="btn tap-button" onclick={handleTap}>TAP</button>

        <div class="play-button-wrapper">
          <Button shape="circle" onclick={handlePlayPressed}>
            <Icon icon={metrnomeInterval ? "stop" : "playArrow"} />
          </Button>
        </div>

        <p class="beat-counter">{currentBeatCount || "-"}</p>
      </div>

      <hr />

      <div class="time-signature-input-container">
        <Label>Time Signature</Label>
        <div class="input-row">
          <Select
            onchange={handleInputChange}
            bind:value={inputBeatCount}
            options={Array.from({ length: 16 }, (_, i) => ({
              label: `${i + 1}`,
              value: i + 1,
            }))}
          />
          <p>/</p>
          <Select
            onchange={handleInputChange}
            bind:value={inputBeatValueCount}
            options={[
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "4", value: 4 },
              { label: "8", value: 8 },
              { label: "16", value: 16 },
            ]}
          />
        </div>
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

  .bpm-container {
    display: grid;
    place-items: center;
  }

  input[type="range"].slider {
    -webkit-appearance: none;
    width: 100%;
    max-width: 200px;
    height: 4px;
    background-color: var(--color-bg-surface-dark);
    border-radius: var(--radius-full);
    outline: none;
  }

  input[type="range"].slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-bg-brand);
    cursor: pointer;
    border-radius: var(--radius-full);
  }

  .input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-16);

    margin-top: var(--space-16);
  }

  .play-input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 60px;
    max-width: 350px;
    margin-inline: auto;
    margin-top: var(--space-24);
    margin-bottom: var(--space-24);

    background-color: var(--color-bg-surface-dark);
    border-radius: var(--radius-8);
  }

  .tap-button {
    flex: 1;
    display: grid;
    place-items: center;

    height: 100%;
    padding: 0;
    border: none;

    background-color: transparent;
    color: var(--color-text, #111111);
  }
  .tap-button:hover {
    background-color: var(--color-surface-dark-hover);
  }

  .play-button-wrapper {
    flex: 1;
    display: grid;
    place-items: center;

    height: 100%;
  }

  .beat-counter {
    flex: 1;
    height: 100%;

    text-align: center;
    align-content: center;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
  }

  .time-signature-input-container {
    display: grid;
    gap: var(--space-4);

    max-width: 400px;
    margin: 0 auto;
    margin-top: var(--space-16);
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: var(--space-12);
  }
</style>
