<script lang="ts">
  import InteractiveElement from "../UI/InteractiveElement.svelte";

  type Props = {
    href: string;
    header: string;
    subTextItems: string | string[];
  };

  let { href, header, subTextItems }: Props = $props();
</script>

<InteractiveElement color="surface" variant="outline" size="large" {href}>
  <div class="link-card-container">
    <h3>{header}</h3>
    {#if typeof subTextItems === "string"}
      <p class="text-body-muted">{subTextItems}</p>
    {:else}
      <div class="subtext-container">
        {#each subTextItems as text, idx (idx)}
          <p class="text-body-muted">{text}</p>
        {/each}
      </div>
    {/if}
  </div>
</InteractiveElement>

<style>
  .link-card-container {
    padding: var(--space-12);
  }

  .subtext-container {
    display: flex;
    gap: var(--space-8);
  }
</style>
