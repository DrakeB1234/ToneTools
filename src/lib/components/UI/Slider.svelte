<script lang="ts">
  interface Props {
    value: number;
    min: number;
    max: number;
    step?: number;
    id?: string;
    ariaLabel?: string;
    class?: string;
    onchange?: (event: Event) => void;
    [key: string]: any;
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    id,
    ariaLabel,
    class: className = "",
    onchange,
    ...rest
  }: Props = $props();
</script>

<input
  type="range"
  {id}
  {min}
  {max}
  {step}
  bind:value
  aria-label={ariaLabel}
  class="custom-slider {className}"
  {onchange}
  {...rest}
/>

<style>
  .custom-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-base);
    outline: none;
    cursor: pointer;
  }

  .custom-slider:focus-visible {
    outline: 2px solid var(--color-bg-primary);
    outline-offset: 10px;
  }

  .custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-bg-primary);
    border-radius: var(--radius-full);
    transition: transform 0.1s ease;
  }

  .custom-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--color-bg-primary);
    border: none;
    border-radius: var(--radius-full);
    transition: var(--transition-color);
  }

  .custom-slider:active::-webkit-slider-thumb {
    background-color: var(--color-bg-primary-active);
  }
  .custom-slider:active::-moz-range-thumb {
    background-color: var(--color-bg-primary-active);
  }
</style>
