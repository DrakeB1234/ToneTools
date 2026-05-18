<script>
  import { page } from "$app/state";
  import { toolsData, exercisesData } from "$lib/data/appData";
</script>

<aside>
  <div class="wrapper">
    <a href="/" class="container__logo">
      <img src="/images/logo.svg" alt="Music App Logo" width="32" height="32" />
      <h1 class="header-base">Music App</h1>
    </a>
    <nav aria-label="Main Navigation">
      <h3>Exercises</h3>
      <ul role="list">
        {#each exercisesData as data (data.name)}
          <li>
            <a
              class="nav-link"
              class:active={data.href === page.url.pathname}
              href={data.href}>{data.name}</a
            >
          </li>
        {/each}
      </ul>
      <h3>Tools</h3>
      <ul role="list">
        {#each toolsData as data (data.name)}
          <li>
            <a
              class="nav-link"
              class:active={data.href === page.url.pathname}
              href={data.href}>{data.name}</a
            >
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</aside>

<style>
  aside {
    display: flex;
    flex-direction: column;

    height: 100dvh;
    width: 26dvw;
    max-width: 300px;
    min-width: 180px;
    padding: var(--space-12);

    border-right: 1px solid var(--color-border);
    background-color: var(--color-bg-surface);
  }

  .container__logo {
    display: flex;
    align-items: center;
    gap: var(--space-12);
  }

  nav {
    margin-top: var(--space-24);
  }

  nav > h3:not(:first-child) {
    margin-top: var(--space-24);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);

    margin-top: var(--space-12);
  }

  a.nav-link {
    display: block;

    padding: var(--space-12);
    border-radius: var(--radius-8);

    color: var(--color-text-muted);
    transition: var(--transition-color);
  }

  a.nav-link:hover:not(.active) {
    background-color: var(--color-hover-surface);
  }
  a.nav-link.active {
    color: var(--color-text-inverse);
    background-color: var(--color-bg-primary);
  }

  @media (max-width: 600px) {
    aside {
      display: none;
    }
  }
</style>
