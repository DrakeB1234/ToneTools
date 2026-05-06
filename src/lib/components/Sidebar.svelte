<aside>
  <div class="container__logo">
    <img src="images/logo.svg" alt="Music App Logo" width="40" height="40" />
    <h1 class="small">Music App</h1>
  </div>

  <nav aria-label="Main Navigation">
    <h3>Exercises</h3>
    <ul role="list">
      <li>
        <a class="light active" href="/">Keys</a>
      </li>
      <li><a class="light" href="/">Intervals</a></li>
      <li><a class="light" href="/">Chords</a></li>
      <li><a class="light" href="/">Note Naming</a></li>
    </ul>
    <h3>Tools</h3>
    <ul role="list">
      <li><a class="light" href="/">Metronome</a></li>
      <li><a class="light" href="/">Scales Explorer</a></li>
      <li><a class="light" href="/">Polyrhythm Maker</a></li>
      <li><a class="light" href="/">Chord Search</a></li>
      <li><a class="light" href="/">Chord Progression Creator</a></li>
    </ul>
  </nav>
</aside>

<style>
  aside {
    display: flex;
    flex-direction: column;

    height: 100dvh;
    width: 20dvw;
    max-width: 320px;
    min-width: 200px;
    padding: var(--space-16);

    border-right: 1px solid var(--color-border);
    background-color: var(--color-bg-surface);
  }

  div.container__logo {
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

  li {
    list-style: none;
    width: 100%;
  }

  li a {
    display: flex;
    align-items: center;

    width: 100%;
    padding: var(--space-4) var(--space-12);
    border-radius: var(--radius-8);

    text-decoration: none;
    transition: var(--transition-color);
  }

  li a:hover {
    background-color: var(--palette-neutral-300);
  }

  /* 4. Active state */
  li a.active {
    background-color: var(--palette-primary-300);
    color: var(--palette-white);
  }
</style>
