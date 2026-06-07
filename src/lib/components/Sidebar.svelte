<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { toolsData, exercisesData } from "$lib/data/appData";
  import Icon from "./Icons/Icon.svelte";
  import Button from "./UI/Button.svelte";

  let isOpen = $state(false);

  function toggleSidebar() {
    isOpen = !isOpen;
  }

  function closeSidebar() {
    isOpen = false;
  }

  onNavigate(() => {
    closeSidebar();
  });
</script>

<header class="mobile-navbar">
  <a href="/" class="logo-container">
    <img src="/images/logo.svg" alt="Music App Logo" width="32" height="32" />
    <h1 class="text-heading-2">Music App</h1>
  </a>
  <Button
    color="surface"
    variant="text"
    size="icon"
    onclick={toggleSidebar}
    aria-label="Open menu"
  >
    <Icon icon="menu" />
  </Button>
</header>

{#if isOpen}
  <div class="backdrop" onclick={closeSidebar} role="none"></div>
{/if}

<aside class:open={isOpen}>
  <div class="wrapper">
    <div class="desktop-header">
      <a href="/" class="logo-container">
        <img
          src="/images/logo.svg"
          alt="Music App Logo"
          width="32"
          height="32"
        />
        <h1 class="text-heading-2">Music App</h1>
      </a>
    </div>

    <div class="mobile-header">
      <a href="/" class="logo-container">
        <img
          src="/images/logo.svg"
          alt="Music App Logo"
          width="32"
          height="32"
        />
        <h1 class="text-heading-2">Music App</h1>
      </a>
      <Button
        color="surface"
        variant="text"
        size="icon"
        onclick={closeSidebar}
        aria-label="Close menu"
      >
        <Icon icon="close" />
      </Button>
    </div>

    <nav aria-label="Main Navigation">
      <h3>Exercises</h3>
      <ul role="list">
        {#each exercisesData as data (data.name)}
          <li>
            <a
              class="nav-link"
              class:active={page.url.pathname.includes(data.urlName)}
              href={data.href}
            >
              {data.name}
            </a>
          </li>
        {/each}
      </ul>

      <h3>Tools</h3>
      <ul role="list">
        {#each toolsData as data (data.name)}
          <li>
            <a
              class="nav-link"
              class:active={page.url.pathname.includes(data.urlName)}
              href={data.href}
            >
              {data.name}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</aside>

<style>
  .mobile-navbar,
  .mobile-header,
  .backdrop {
    display: none;
  }

  .desktop-header {
    display: flex;
    align-items: center;
    gap: var(--space-12);

    margin-bottom: var(--space-24);
  }

  aside {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    position: sticky;
    top: 0;
    z-index: 10;

    height: 100dvh;
    width: 25dvw;
    max-width: 300px;
    padding: var(--space-12);
    overflow-y: auto;

    border-right: 1px solid var(--color-border);
    background-color: var(--color-bg-surface);
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: var(--space-12);
  }

  nav > h3 {
    margin-top: var(--space-24);
    margin-bottom: var(--space-8);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  a.nav-link {
    display: block;

    padding: var(--space-12);
    border-radius: var(--radius-8);

    color: var(--color-text-muted);
    transition: var(--transition-color);
  }

  a.nav-link:hover:not(.active) {
    background-color: var(--color-surface-hover);
  }
  a.nav-link.active {
    color: var(--color-text-inverse);
    background-color: var(--color-bg-brand);
  }

  @media (max-width: 768px) {
    .mobile-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: var(--space-12) var(--space-16);
      width: 100%;

      background-color: var(--color-bg-surface);
      border-bottom: 1px solid var(--color-border);
    }

    .desktop-header {
      display: none;
    }

    .mobile-header {
      display: flex;
      justify-content: space-between;
    }

    aside {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;

      width: 80dvw;
      max-width: 320px;

      border-right: 1px solid var(--color-border);

      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    aside.open {
      transform: translateX(0);
    }

    .backdrop {
      display: block;

      position: fixed;
      inset: 0;
      z-index: 10;

      background-color: rgba(0, 0, 0, 0.4);
    }
  }
</style>
