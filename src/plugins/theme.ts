import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

// Echoes the original Angular Material console's palette: a pink accent
// for primary actions against the teal/purple toolbar (see App.vue, SiteNav.vue).
export const HopupsPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#fff0f5",
      100: "#ffd6e5",
      200: "#ffabc9",
      300: "#ff80ad",
      400: "#ff5a97",
      500: "#ff4081",
      600: "#f50057",
      700: "#c51162",
      800: "#9c0f4e",
      900: "#7a0d3f",
      950: "#4a0726"
    }
  }
});
