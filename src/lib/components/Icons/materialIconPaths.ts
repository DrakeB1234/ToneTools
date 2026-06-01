export const materialIconPaths = {
  close: '<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />',
  arrowRightAlt: '<path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />',
  arrowLeftAlt: '<path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>',
  playArrow: `<path d="M320-200v-560l440 280-440 280Z"/>`,
  menu: `<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>`,
  minus: `<path d="M200-440v-80h560v80H200Z"/>`,
  plus: `<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>`,
  stop: `<path d="M240-240v-480h480v480H240Z"/>`,
};
export type MaterialIconPathNames = keyof typeof materialIconPaths;