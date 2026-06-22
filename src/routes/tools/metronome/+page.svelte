<script lang="ts">
  import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import InteractiveElement from "$lib/components/UI/InteractiveElement.svelte";
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

    <section class="card">
      <div class="bpm-container lay-grid-center">
        <h2 class="ui-xlarge">{inputBpmAmount}</h2>
        <p>BPM</p>
      </div>

      <div class="input-container lay-row space-above-base">
        <Button
          variant="outlined"
          size="icon-small"
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
          variant="outlined"
          size="icon-small"
          onclick={() => handleBpmButtonPress(1)}><Icon icon="plus" /></Button
        >
      </div>

      <div class="play-input-container lay-row space-above-large">
        <div class="tap-button-wrapper">
          <InteractiveElement
            variant="text"
            onclick={handleTap}
            fullWidth
            fullHeight
          >
            <p>TAP</p>
          </InteractiveElement>
        </div>
        <div class="lay-grid-center">
          <Button size="icon-base" circle onclick={handlePlayPressed}>
            <Icon icon={metrnomeInterval ? "stop" : "playArrow"} />
          </Button>
        </div>
        <div class="lay-grid-center">
          <p>{currentBeatCount || "-"}</p>
        </div>
      </div>

      <hr class="space-above-large" />

      <div class="time-signature-input-container space-above-small">
        <div class="lay-input-label-col">
          <Label>Time Signature</Label>
          <div class="lay-row">
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
    gap: 0;
  }

  input[type="range"].slider {
    -webkit-appearance: none;
    width: 100%;
    max-width: 200px;
    height: 4px;
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-base);
    outline: none;
  }

  input[type="range"].slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-bg-primary);
    cursor: pointer;
    border-radius: var(--radius-full);
  }

  .input-container {
    justify-content: center;
    gap: var(--space-16);
  }

  .play-input-container {
    justify-content: space-between;

    height: 60px;
    max-width: 350px;
    margin-inline: auto;

    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-base);
  }
  .play-input-container > div {
    flex: 1;
    height: 100%;
  }

  .time-signature-input-container {
    max-width: 400px;
    margin-inline: auto;
  }
</style>
