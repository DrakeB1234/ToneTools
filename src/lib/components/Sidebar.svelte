<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { toolsData, exercisesData } from "$lib/data/appData";
  import Icon from "./Icons/Icon.svelte";
  import Button from "./UI/Button.svelte";

  let isOpen = $state(false);
  let isDarkMode = $state(false);

  function toggleSidebar() {
    isOpen = !isOpen;
  }

  function closeSidebar() {
    isOpen = false;
  }

  function handleToggleLightMode() {
    isDarkMode = !isDarkMode;
  }

  $effect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  });

  onNavigate(() => {
    closeSidebar();
  });
</script>

<header class="lay-row mobile-navbar">
  <a href="/" class="lay-row mobile-logo-container">
    <img src="/images/logo.svg" alt="Music App Logo" width="32" height="32" />
    <h1 class="text-heading-2">Music App</h1>
  </a>
  <Button
    variant="text"
    size="icon-base"
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
  <div>
    <div class="lay-row desktop-header">
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

    <div class="lay-row mobile-header">
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
        variant="text"
        size="icon-base"
        onclick={closeSidebar}
        aria-label="Close menu"
      >
        <Icon icon="close" />
      </Button>
    </div>

    <nav aria-label="Main Navigation">
      <h3>Exercises</h3>
      <ul class="lay-col space-above-base" role="list">
        {#each exercisesData as data (data.name)}
          <li>
            <a
              class="nav-link"
              class:active={page.url.pathname.includes(data.urlName)}
              href={data.href}
            >
              <Icon icon={data.icon} />
              {data.name}
            </a>
          </li>
        {/each}
      </ul>

      <h3>Tools</h3>
      <ul class="lay-col space-above-base" role="list">
        {#each toolsData as data (data.name)}
          <li>
            <a
              class="nav-link"
              class:active={page.url.pathname.includes(data.urlName)}
              href={data.href}
            >
              <Icon icon={data.icon} />
              {data.name}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="light-mode-button-container space-above-large">
      <Button
        variant="text"
        onclick={handleToggleLightMode}
        aria-label="Switch Light/Dark Mode"
        fullWidth
      >
        <div class="lay-row">
          <Icon icon={isDarkMode ? "lightMode" : "darkMode"} />
          Switch to {isDarkMode ? "light mode" : "dark mode"}
        </div>
      </Button>
    </div>
  </div>
</aside>

<style>
  .mobile-navbar,
  .mobile-header,
  .backdrop {
    display: none;
  }

  .desktop-header {
    gap: var(--space-12);
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
    min-width: 210px;
    max-width: 260px;
    overflow-y: auto;

    border-right: 1px solid var(--color-border-subtle);
    background-color: var(--color-bg-surface-1);
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: var(--space-12);
    padding: var(--space-12);
  }

  nav > h3 {
    margin-top: var(--space-24);
    margin-bottom: var(--space-8);
    margin-left: var(--space-12);
  }

  ul {
    padding-inline: var(--space-8);
  }

  a.nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-8);

    padding: var(--space-12);

    border-radius: var(--radius-base);
    color: var(--color-on-bg-surface-subtle);
    transition: var(--transition-color);
  }

  a.nav-link:hover:not(.active) {
    background-color: var(--color-bg-surface-1-active);
  }
  a.nav-link.active {
    color: var(--color-on-bg-primary-subtle);
    background-color: var(--color-bg-primary-subtle);
  }

  .mobile-logo-container {
    gap: var(--space-16);
  }

  .mobile-navbar {
    justify-content: space-between;
    padding: var(--space-12);
    width: 100%;

    background-color: var(--color-bg-surface-1);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .mobile-header {
    justify-content: space-between;
    padding-right: var(--space-8);
  }

  .light-mode-button-container {
    padding: var(--space-8);
  }

  @media (max-width: 768px) {
    .mobile-navbar {
      display: flex;
    }

    .desktop-header {
      display: none;
    }

    .mobile-header {
      display: flex;
    }

    aside {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;

      width: 80dvw;
      max-width: 320px;

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
