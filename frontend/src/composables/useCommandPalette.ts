import { onBeforeUnmount, onMounted, ref } from "vue";

const isOpen = ref(false);
let hotkeyListenerCount = 0;

function handleKeydown(event: KeyboardEvent) {
  const isMeta = event.metaKey || event.ctrlKey;
  if (isMeta && event.key.toLowerCase() === "k") {
    event.preventDefault();
    isOpen.value = !isOpen.value;
  }
  if (event.key === "Escape" && isOpen.value) {
    isOpen.value = false;
  }
}

/** Call once, from the app shell: wires the global Ctrl/Cmd+K and Escape hotkeys. */
export function useCommandPaletteHotkey() {
  onMounted(() => {
    if (hotkeyListenerCount === 0) {
      window.addEventListener("keydown", handleKeydown);
    }
    hotkeyListenerCount += 1;
  });

  onBeforeUnmount(() => {
    hotkeyListenerCount -= 1;
    if (hotkeyListenerCount === 0) {
      window.removeEventListener("keydown", handleKeydown);
    }
  });
}

/** Shared open/close state for the command palette, safe to use from any component. */
export function useCommandPalette() {
  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return { isOpen, open, close, toggle };
}
