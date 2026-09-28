import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

/**
 * Phosphor-green primary ramp (replaces Aura's default emerald) and squared,
 * instrument-panel border radii. Persistent chrome (sidebar/topbar/console
 * panels) is styled directly with the tokens in src/style.css rather than
 * PrimeVue's surface ramp; this preset only reaches the atoms PrimeVue itself
 * renders (buttons, inputs, tags, overlays) so they read as the same system.
 */
export const missionControlPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#eafbf0",
      100: "#c9f6d8",
      200: "#96edb3",
      300: "#5fe08c",
      400: "#39ff6a",
      500: "#1f9b4c",
      600: "#17803e",
      700: "#10632f",
      800: "#0b4620",
      900: "#062c14",
      950: "#03160a",
    },
    focusRing: {
      width: "2px",
      style: "solid",
      color: "{primary.color}",
      offset: "2px",
    },
  },
  primitive: {
    borderRadius: {
      none: "0",
      xs: "1px",
      sm: "2px",
      md: "3px",
      lg: "4px",
      xl: "6px",
    },
  },
});
