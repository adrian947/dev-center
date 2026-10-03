import { computed, ref } from "vue";
import { byteLength, MAX_INPUT_BYTES, type ToolResult } from "@/utils/devtools/result.js";

export function useToolIO() {
  const input = ref("");
  const output = ref("");
  const error = ref<string | null>(null);

  const tooLarge = computed(() => byteLength(input.value) > MAX_INPUT_BYTES);

  async function run(action: () => ToolResult | Promise<ToolResult>): Promise<boolean> {
    if (tooLarge.value) {
      output.value = "";
      error.value = "tooLarge";
      return false;
    }

    const result = await action();
    if (result.ok) {
      output.value = result.value;
      error.value = null;
      return true;
    }

    output.value = "";
    error.value = result.error;
    return false;
  }

  function clear(): void {
    input.value = "";
    output.value = "";
    error.value = null;
  }

  return { input, output, error, tooLarge, run, clear };
}
