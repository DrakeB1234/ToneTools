<script lang="ts">
  import Button from "./UI/Button.svelte";
  import { page } from "$app/state";
  import { toolsData, exercisesData } from "$lib/data/appData";

  interface LinkEntry {
    label: string;
    href: string;
  }

  let exerciseLinks: LinkEntry[] = [
    { label: "Scales", href: "/" },
    { label: "Chords", href: "/exercises/chords" },
    { label: "Rhythm", href: "/exercises/rhythm" },
  ];

  let toolLinks: LinkEntry[] = [
    { label: "Metronome", href: "/tools/metronome" },
    { label: "Scales Explorer", href: "/tools/scalesexplorer" },
    { label: "Tap BPM", href: "/tools/tapbpm" },
    {
      label: "Chord Progression Creator",
      href: "/tools/chordprogressioncreator",
    },
  ];
</script>

<aside>
  <div class="wrapper">
    <a href="/" class="container__logo">
      <img src="/images/logo.svg" alt="Music App Logo" width="32" height="32" />
      <h1 class="small">Music App</h1>
    </a>
    <nav aria-label="Main Navigation">
      <h3>Exercises</h3>
      <ul role="list">
        {#each exercisesData as data (data.name)}
          <li>
            <Button
              element="a"
              variant="text"
              size="small"
              href={data.href}
              class={page.url.pathname === data.href ? "active" : ""}
            >
              <p class="caption muted">{data.name}</p>
            </Button>
          </li>
        {/each}
      </ul>
      <h3>Tools</h3>
      <ul role="list">
        {#each toolsData as data (data.name)}
          <li>
            <Button
              element="a"
              variant="text"
              size="small"
              href={data.href}
              class={page.url.pathname === data.href ? "active" : ""}
            >
              <p class="caption muted">{data.name}</p>
            </Button>
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

  li :global(.btn) {
    justify-content: flex-start;
    width: 100%;
  }

  @media (max-width: 600px) {
    aside {
      display: none;
    }
  }
</style>
