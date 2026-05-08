<script>
  import HeroCard from "$lib/components/Cards/HeroCard.svelte";
  import LastUsedCard from "$lib/components/Cards/LastUsedCard.svelte";
  import ToolCard from "$lib/components/Cards/ToolCard.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { exercisesData, toolsData } from "$lib/data/appData";

  const lastUsedItems = [exercisesData[0], exercisesData[1], toolsData[0]];
</script>

<div class="page">
  <Sidebar />
  <Wrapper>
    <main>
      <HeroCard />

      <div class="section">
        <h3>Last Used</h3>

        <div class="cards-container">
          {#each lastUsedItems as item}
            <LastUsedCard
              title={item.name}
              description={item.description}
              color={item.color}
              icon={item.icon}
            />
          {/each}
        </div>
      </div>

      <div class="section">
        <h3>Tools</h3>

        <div class="cards-grid">
          {#each toolsData as item}
            <ToolCard
              title={item.name}
              description={item.description}
              color={item.color}
              icon={item.icon}
            />
          {/each}
        </div>
      </div>
    </main>
  </Wrapper>
</div>

<style>
  .page {
    display: flex;
  }

  main {
    width: 100%;
    padding: var(--space-24) var(--space-36);
  }

  .section {
    margin-top: var(--space-36);
  }

  .cards-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);

    margin-top: var(--space-16);
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
    align-items: stretch;
    gap: var(--space-12);

    margin-top: var(--space-16);
  }
</style>
