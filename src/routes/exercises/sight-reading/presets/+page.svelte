<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { presets } from "../helpers";

  function handlePresetClick(idx: number) {
    const presetObj = presets[idx];
    if (!presetObj) return;

    goto("/exercises/sight-reading/play", {
      state: {
        config: presetObj.config,
      },
    });
  }
</script>

<Wrapper>
  <main>
    <PageHeaderContainer
      subText="Sight Reading"
      headerText="Presets"
      fallbackHref="/exercises/sight-reading"
      useHistory={false}
    />

    <section class="card">
      <div class="title">
        <h3>Beginner</h3>
      </div>
      {#each presets as preset, i (preset.name)}
        <Button
          variant="text"
          fullWidth
          class="preset-link__button"
          onclick={() => handlePresetClick(i)}
        >
          <div class="preset-link lay-col lay-gap-0">
            <p class="text-heading-3">{preset.name}</p>
            <p class="text-caption-muted space-above-xsmall text-max-width-med">
              {preset.description}
            </p>
            <div class="preset-link__pills lay-row lay-gap-4 space-above-base">
              <p class="pill lay-row lay-gap-4">
                <Icon icon="musicNote" size="var(--icon-size-small)" />
                {preset.config.noteRange.low} - {preset.config.noteRange.high}
              </p>
              <p class="pill lay-row lay-gap-4">
                <Icon icon="timer" size="var(--icon-size-small)" />
                {preset.config.timer}
              </p>
            </div>
          </div>
        </Button>
        {#if i < presets.length - 1}
          <hr />
        {/if}
      {/each}
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
    padding-bottom: var(--space-16);
  }
  .title {
    padding: var(--space-16);
  }
  .card :global(.preset-link__button) {
    justify-content: start;
    text-align: left;
  }
  .preset-link {
    padding: var(--space-4);
  }
  .preset-link__pills {
    flex-wrap: wrap;
    align-items: stretch;
  }
  .preset-link__pills > .pill {
    height: 100%;
  }
</style>
