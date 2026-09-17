<script lang="ts">
  let {
    toggled = $bindable(false),
    disabled = false,
    ariaLabel = "Toggle switch",
    size = "medium",
    ontoggle = () => {},
    ...rest
  } = $props();
</script>

<label class="toggle-label {size}" aria-disabled={disabled}>
  <input
    type="checkbox"
    bind:checked={toggled}
    {disabled}
    aria-label={ariaLabel}
    onclick={() => ontoggle()}
    {...rest}
  />

  <span class="slider"></span>
</label>

<style>
  .toggle-label {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
    cursor: pointer;

    -webkit-tap-highlight-color: transparent;
  }

  .toggle-label[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .toggle-label input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: inherit;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-bg-secondary);
    transition: var(--transition-color);
    border-radius: var(--radius-full);
  }

  .slider:hover {
    background-color: var(--color-bg-secondary-active);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: var(--color-bg-surface-1);
    transition: transform 0.1s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  input:checked + .slider {
    background-color: var(--color-bg-primary);
  }

  input:checked + .slider:hover {
    background-color: var(--color-bg-primary-active);
  }

  input:checked + .slider:before {
    transform: translateX(16px);
  }

  input:focus-visible + .slider {
    outline: 2px solid var(--color-bg-primary);
    outline-offset: 2px;
  }

  .toggle-label.small {
    width: 32px;
    height: 20px;
  }

  .toggle-label.small .slider:before {
    height: 16px;
    width: 16px;
  }

  .toggle-label.small input:checked + .slider:before {
    transform: translateX(12px);
  }
</style>
