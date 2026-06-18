<script lang="ts">
  import "$lib/components/Popups/popup.css";
  import Icon from "../Icons/Icon.svelte";
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

<div class="popup-card">
  <div class="popup-header">
    <h2 class="text-heading-3">{title}</h2>
    <Button
      color="surface"
      variant="text"
      shape="small"
      onclick={() => handleResponse(false)}
    >
      <Icon icon="close" />
    </Button>
  </div>

  <div class="popup-body">
    <p class="muted">{message}</p>
  </div>

  <div class="popup-footer">
    <Button
      color="surface"
      variant="outline"
      shape="large"
      onclick={() => handleResponse(false)}>Cancel</Button
    >
    <Button shape="large" onclick={() => handleResponse(true)}
      >{confirmationText}</Button
    >
  </div>
</div>
