<script>
  import HeroCard from "$lib/components/Cards/HeroCard.svelte";
  import LastUsedCard from "$lib/components/Cards/LastUsedCard.svelte";
  import ToolCard from "$lib/components/Cards/ToolCard.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { exercisesData, toolsData } from "$lib/data/appData";

  const lastUsedItems = [exercisesData[0], toolsData[0], toolsData[1]];
</script>

<svelte:head>
  <title>Tone Tools</title>
</svelte:head>

<Wrapper>
  <main>
    <HeroCard />

    <section>
      <h3>Last Used</h3>

      <div class="lay-col space-above-small">
        {#each lastUsedItems as item}
          <LastUsedCard
            title={item.name}
            description={item.description}
            color={item.color}
            icon={item.icon}
            href={item.href}
          />
        {/each}
      </div>
    </section>

    <section>
      <h3>Tools</h3>

      <div class="lay-grid-cards space-above-small">
        {#each toolsData as item}
          <ToolCard
            title={item.name}
            description={item.description}
            href={item.href}
            color={item.color}
            icon={item.icon}
          />
        {/each}
      </div>
    </section>
  </main>
</Wrapper>

<style>
  main {
    width: 100%;
    padding: var(--app-padding);
  }

  section {
    margin-top: var(--space-36);
  }
</style>
