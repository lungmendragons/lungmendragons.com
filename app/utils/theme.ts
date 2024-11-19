import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import { useDark, useToggle } from "@vueuse/core";
import { darkTheme, lightTheme } from "naive-ui";

const globalOverrides = {
  fontFamily: `Inter18pt, v-sans, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  primaryColorHover: "#93c5fd",
  primaryColorPressed: "#76b5fb",
  primaryColorSuppl: "#2a7194",
};

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...globalOverrides,
    primaryColor: "#3992ff",
    bodyColor: "#e5e5e5",
    cardColor: "#fafafa",
  },
};

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...globalOverrides,
    primaryColor: "#60a5fa",
    bodyColor: "#111112",
    cardColor: "#1e1e20",
    textColor1: "#ffffff",
    textColor2: "#ffffff",
  },
};

export const theme: Ref<GlobalTheme> = ref(darkTheme);
export const themeOverrides: Ref<GlobalThemeOverrides> = ref(darkThemeOverrides);

export const isDark: ComputedRef<boolean> = useDark({
  onChanged(dark: boolean) {
    theme.value = dark ? darkTheme : lightTheme;
    themeOverrides.value = dark ? darkThemeOverrides : lightThemeOverrides;
  },
});

export const toggleDark: () => boolean = useToggle(isDark);
