<script lang="ts">
  import Icon from "../Icons/Icon.svelte";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";

  type Props = {
    id: string;
    value: any;
    onStepperClick: (direction: number) => void;
  };

  let { id, value, onStepperClick }: Props = $props();
</script>

<div class="stepper-input">
  <div class="decrement-button-wrapper">
    <Button
      color="surface"
      variant="outline"
      shape="small"
      onclick={() => onStepperClick(-1)}
      aria-label="Decrease {id}"
    >
      <Icon icon="minus" />
    </Button>
  </div>

  <div class="input-wrapper">
    <Input
      {id}
      {value}
      placeholder="0"
      style="text-align: center; border-color: transparent;"
      tabindex={-1}
      readonly
    />
  </div>

  <div class="increment-button-wrapper">
    <Button
      color="surface"
      variant="outline"
      shape="small"
      onclick={() => onStepperClick(1)}
      aria-label="Decrease {id}"
    >
      <Icon icon="plus" />
    </Button>
  </div>
</div>

<style>
  .stepper-input {
    display: flex;
    align-items: end;
    gap: var(--space-8);
  }
  .input-wrapper {
    pointer-events: none;
    max-width: 5ch;
  }
</style>
