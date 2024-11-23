type Queries = "minWidth" | "maxWidth" | "minHeight" | "maxHeight";

interface Breakpoints {
  xxs?: string;
  xs?: string;
  sm: string;
  md: string;
  lg: string;
  xl?: string;
  xxl?: string;
};

export const breakpoints = {
  // Custom
  xxs: "360px",
  xs: "432px",
  sm: "576px",

  // Tailwind defaults
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  xxl: "1536px",
};

export const mediaQuery: Record<Queries, Breakpoints> = {
  minWidth: {
    xxs: `(min-width: ${breakpoints.xxs})`,
    xs: `(min-width: ${breakpoints.xs})`,
    sm: `(min-width: ${breakpoints.sm})`,
    md: `(min-width: ${breakpoints.md})`,
    lg: `(min-width: ${breakpoints.lg})`,
    xl: `(min-width: ${breakpoints.xl})`,
    xxl: `(min-width: ${breakpoints.xxl})`,
  },
  maxWidth: {
    xxs: `(max-width: ${breakpoints.xxs})`,
    xs: `(max-width: ${breakpoints.xs})`,
    sm: `(max-width: ${breakpoints.sm})`,
    md: `(max-width: ${breakpoints.md})`,
    lg: `(max-width: ${breakpoints.lg})`,
    xl: `(max-width: ${breakpoints.xl})`,
    xxl: `(max-width: ${breakpoints.xxl})`,
  },
  minHeight: {
    sm: "(min-height: 360px)",
    md: "(min-height: 400px)",
    lg: "(min-height: 440px)",
  },
  maxHeight: {
    sm: "(max-height: 360px)",
    md: "(max-height: 400px)",
    lg: "(max-height: 440px)",
  },
};
