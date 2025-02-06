import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import { useDark, useToggle } from "@vueuse/core";
import { darkTheme, lightTheme } from "naive-ui";

const lightPrimaryColor = "#3992ff";
const lightBodyColor = "#e5e5e5";
const lightCardColor = "#fafafa";
const darkPrimaryColor = "#60a5fa";
const darkBodyColor = "#111112";
const darkCardColor = "#1e1e20";

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
    primaryColor: lightPrimaryColor,
    bodyColor: lightBodyColor,
    cardColor: lightCardColor,
  },
  List: { // affects: SGL2, Resource Index
    color: `${lightCardColor}f0`,
  },
  Tabs: { // affects: SGL2 (not Bingo Lockout 3 since it doesn't use segment tab type)
    tabTextColorSegment: "#ffffffbf",
    tabTextColorActiveSegment: "#ffffff",
    colorSegment: "#7777",
    tabColorSegment: `${lightPrimaryColor}d0`,
    fontWeightStrong: "700",
  },
};

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    ...globalOverrides,
    primaryColor: darkPrimaryColor,
    bodyColor: darkBodyColor,
    cardColor: darkCardColor,
    textColor1: "#ffffff",
    textColor2: "#ffffff",
  },
  List: { // affects: SGL2, Resource Index
    color: `${darkCardColor}f0`,
  },
  Tabs: { // affects: SGL2 (not Bingo Lockout 3 since it doesn't use segment tab type)
    tabTextColorSegment: "#ffffffbf",
    colorSegment: "#7777",
    tabColorSegment: `${darkPrimaryColor}d0`,
    fontWeightStrong: "700",
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
