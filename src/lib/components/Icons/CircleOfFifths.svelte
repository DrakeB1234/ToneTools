<script>
  let { size = "var(--icon-size-base)", color = "currentColor" } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 240 240"
  fill={color}
>
  <path
    fill-rule="evenodd"
    d="M120 232a110 110 0 1 0 0-220 110 110 0 0 0 0 220Zm0-27c46 0 83-37 83-83 0-47-37-84-83-84s-84 37-84 84c0 46 38 83 84 83Z"
  />
  <path
    d="M91 69c0-4 4-8 8-8 12 0 22 10 22 22v8h13c14 0 28 21 28 32v9c0 14-15 32-41 41l-17 4c-7 1-13-4-13-11V69Zm42 54-7-3c-3 0-5 2-5 6v16c3 0 12-8 12-19Z"
  />
</svg>
