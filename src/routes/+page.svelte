<script>
  import HeroCard from "$lib/components/Cards/HeroCard.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
</script>

<div>
  <Sidebar />
  <Wrapper>
    <main>
      <HeroCard />
      <div class="section-lastused">
        <h3>Last Used</h3>
      </div>
    </main>
  </Wrapper>
</div>

<style>
  div {
    display: flex;
  }

  main {
    width: 100%;
    padding: var(--space-24);
  }

  .section-lastused {
    margin-top: var(--space-36);
  }
</style>
