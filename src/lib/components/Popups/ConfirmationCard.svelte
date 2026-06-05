<script lang="ts">
  import MaterialIcon from "../Icons/MaterialIcon.svelte";
  import Button from "../UI/Button.svelte";

  type Props = {
    title?: string;
    message?: string;
    confirmationText?: string;
    onResponse: (confirmation: boolean) => void;
  };

  let {
    title = "Confirmation",
    message = "Are you sure?",
    confirmationText = "Confirm",
    onResponse,
  }: Props = $props();

  function handleResponse(confirmation: boolean) {
    onResponse(confirmation);
  }
</script>

<div class="card-base exit-popup-card">
  <div class="top-container">
    <h2 class="text-l">{title}</h2>
    <Button
      color="surface"
      variant="text"
      size="icon"
      onclick={() => handleResponse(false)}
    >
      <MaterialIcon name="close" />
    </Button>
  </div>

  <p class="muted">{message}</p>

  <div class="button-container">
    <Button
      color="surface"
      variant="outline"
      size="large"
      onclick={() => handleResponse(false)}>Cancel</Button
    >
    <Button size="large" onclick={() => handleResponse(true)}
      >{confirmationText}</Button
    >
  </div>
</div>

<style>
  .exit-popup-card {
    background-color: var(--color-bg-surface);

    width: 100%;
    max-width: 400px;
  }

  .top-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: var(--space-12);
  }

  .button-container {
    display: flex;
    justify-content: end;
    gap: var(--space-8);

    margin-top: var(--space-16);
  }
</style>
