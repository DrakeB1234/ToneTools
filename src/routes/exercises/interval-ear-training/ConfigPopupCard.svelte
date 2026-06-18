<script lang="ts">
  import "$lib/components/Popups/popup.css";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Input from "$lib/components/UI/Input.svelte";
  import Label from "$lib/components/UI/Label.svelte";
  import Select from "$lib/components/UI/Select.svelte";
  import type { IntervalEarConfig } from "./intervalEarTrainingHelpers";

  type ConfigProps = {
    configData: IntervalEarConfig;
    onComplete: () => void;
  };

  let { configData = $bindable(), onComplete }: ConfigProps = $props();

  function handleTypeClick(type: "melodic" | "harmonic") {
    if (configData.selectedTypes.includes(type)) {
      configData.selectedTypes = configData.selectedTypes.filter(
        (e) => e !== type,
      );
    } else {
      configData.selectedTypes = [...configData.selectedTypes, type];
    }
  }

  function handleDirectionClick(direction: "descending" | "ascending") {
    if (configData.selectedDirections.includes(direction)) {
      configData.selectedDirections = configData.selectedDirections.filter(
        (e) => e !== direction,
      );
    } else {
      configData.selectedDirections = [
        ...configData.selectedDirections,
        direction,
      ];
    }
  }

  function handlePopupDone() {
    if (configData.selectedTypes.length < 1)
      configData.selectedTypes.push("melodic");
    if (configData.selectedDirections.length < 1)
      configData.selectedDirections.push("ascending");

    onComplete();
  }
</script>

<div class="popup-card">
  <div class="popup-header">
    <h2 class="text-heading-3">Configure</h2>
    <Button
      color="surface"
      variant="text"
      shape="small"
      onclick={handlePopupDone}
    >
      <Icon icon="close" />
    </Button>
  </div>

  <div class="popup-body">
    <div class="input-group">
      <p class="text-caption-muted">Type</p>
      <div class="toggle-buttons">
        <Button
          color="surface"
          variant="outline"
          active={configData.selectedTypes.includes("melodic")}
          onclick={() => handleTypeClick("melodic")}>Melodic</Button
        >
        <Button
          color="surface"
          variant="outline"
          active={configData.selectedTypes.includes("harmonic")}
          onclick={() => handleTypeClick("harmonic")}>Harmonic</Button
        >
      </div>
    </div>
    <div class="input-group space-above">
      <p class="text-caption-muted">Direction</p>
      <div class="toggle-buttons">
        <Button
          color="surface"
          variant="outline"
          active={configData.selectedDirections.includes("ascending")}
          onclick={() => handleDirectionClick("ascending")}>Ascending</Button
        >
        <Button
          color="surface"
          variant="outline"
          active={configData.selectedDirections.includes("descending")}
          onclick={() => handleDirectionClick("descending")}>Descending</Button
        >
      </div>
    </div>
    <p class="space-above">Octave Range</p>
    <div class="octave-range-input space-above-xsmall">
      <div class="input-group">
        <Label labelFor="octave-low">Low</Label>
        <Select
          id="octave-low"
          bind:value={configData.octaveRangeLow}
          options={[
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
            { label: "5", value: 5 },
          ]}
        />
      </div>
      <div class="input-group">
        <Label labelFor="octave-high">High</Label>
        <Select
          id="octave-high"
          bind:value={configData.octaveRangeHigh}
          options={[
            { label: "3", value: 3 },
            { label: "4", value: 4 },
            { label: "5", value: 5 },
            { label: "6", value: 6 },
          ]}
        />
      </div>
    </div>
    <div class="input-group space-above-large">
      <Label labelFor="questions">Questions</Label>
      <Input
        id="questions"
        type="number"
        min="0"
        max="99"
        placeholder="10"
        bind:value={configData.questionsAmount}
      />
    </div>
  </div>

  <div class="popup-footer">
    <Button shape="large" onclick={handlePopupDone}>Confirm</Button>
  </div>
</div>

<style>
  .input-group {
    display: grid;
    gap: var(--space-4);
  }
  .toggle-buttons {
    display: flex;
    gap: var(--space-8);
  }

  .octave-range-input {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-16);

    padding: var(--space-8);

    border-radius: var(--radius-8);
    background-color: var(--color-bg-surface-sunken);
  }
  .octave-range-input > div {
    flex: 1;
  }
</style>
