<script lang="ts">
  import Icon from "$lib/components/Icons/Icon.svelte";
  import PageHeaderContainer from "$lib/components/PageHeaderContainer.svelte";
  import Button from "$lib/components/UI/Button.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";

  function handleKeySelect(newKey: string) {
    console.log(newKey);
  }
</script>

<svelte:head>
  <title>Scales Companion | Tone Tools</title>
</svelte:head>

<Wrapper>
  <main>
    <div class="page-header">
      <PageHeaderContainer headerText="Scales Companion" fallbackHref="/" />
    </div>

    <section class="header-card card space-above-base">
      <div class="header lay-row">
        <div class="header__item--side"></div>
        <div class="header__item">
          <h3 class="text-heading-1">C Major</h3>
        </div>
        <div class="header__item--side lay-row">
          <Button variant="text" size="icon-base">
            <Icon icon="settings" />
          </Button>
        </div>
      </div>
    </section>
  </main>
</Wrapper>

<style>
  .page-header {
    padding: var(--app-padding);
    padding-bottom: 0;
  }
  .header-card {
    margin: var(--app-padding);
  }
  .header {
    justify-content: center;
  }
  .header__item--side {
    flex: 1;
    justify-content: end;
  }
</style>
