<script lang="ts">
  import PageHeaderDetails from "$lib/components/PageHeaderDetails.svelte";
  import PianoSnapshot from "$lib/components/PianoSnapshot.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";

  const cmaj13 = ["C4", "E4", "G4", "B4", "D5", "F5", "A5"];
  const dmaj13 = ["D4", "F#4", "A4", "C#5", "E5", "G5", "B5"];
  const emaj13 = ["E4", "G#4", "B4", "D#5", "F#5", "A5", "C#6"];
  const fmaj13 = ["F4", "A4", "C5", "E5", "G5", "B5", "D6"];
  const e3maj13 = ["E3", "G#3", "B3", "D#4", "F#4", "A4", "C#5"];
</script>

<Wrapper>
  <main>
    <PageHeaderDetails subText="Tools" headerText="Indentify Chord" href="/" />

    <section class="card-base input-card">
      <div class="piano-roll-container">
        <PianoSnapshot
          activeNotes={cmaj13}
          range={{
            start: "C4",
            end: "C6",
          }}
        />
      </div>
    </section>
  </main>
</Wrapper>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);

    width: 100%;
    padding: var(--app-padding);
  }

  .input-card {
    display: grid;
    place-items: center;

    width: 100%;
  }

  .piano-roll-container {
    width: 100%;
    padding-bottom: var(--space-4);

    overflow-x: auto;
  }
</style>
