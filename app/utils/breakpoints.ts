type BreakpointObject = Record<"xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl", string>;

// does setting a type here break the 3D logo responsive dimensions?
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

export const mediaQuery: Record<"minWidth" | "maxWidth", BreakpointObject> = {
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
};
