<script lang="ts">
  // Will attempt at first to redirect using browser history state, otherwise will use fallback href

  import { afterNavigate, goto } from "$app/navigation";
  import Icon from "./Icons/Icon.svelte";
  import Button from "./UI/Button.svelte";

  let { subText, headerText, fallbackHref = "/" } = $props();

  let hasPreviousPage = $state(false);

  // If from is !null, user navigated from inside app
  afterNavigate(({ from }) => {
    if (from) {
      hasPreviousPage = true;
    }
  });

  function handleBack() {
    if (hasPreviousPage) {
      history.back();
    } else {
      goto(fallbackHref);
    }
  }
</script>

<div class="header-container">
  <Button
    element="button"
    color="app"
    variant="text"
    size="icon"
    onclick={handleBack}
    aria-label="Go back"
  >
    <Icon icon="arrowLeftAlt" />
  </Button>

  <div class="text-container">
    <p class="text-caption-muted">{subText}</p>
    <h2>{headerText}</h2>
  </div>
</div>

<style>
  .header-container {
    display: flex;
    gap: var(--space-16);
    align-items: center;
  }
</style>
