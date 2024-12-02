import { defu } from "defu";

type MiddlewareOptions = false | {
  only?:
    | "guest"
    | "user"
    | "writer"
    | "member"
    | "admin";
  redirectUserTo?: string;
  redirectGuestTo?: string;
};

declare module "#app" {
  interface PageMeta {
    auth?: MiddlewareOptions;
  }
};

declare module "vue-router" {
  interface RouteMeta {
    auth?: MiddlewareOptions;
  }
};

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta?.auth === false)
    return;

  const { loggedIn, options, fetchSession } = useAuth();
  const { only, redirectUserTo, redirectGuestTo } = defu(to.meta?.auth, options);

  if (only === "guest" && loggedIn.value) {
    if (to.path === redirectUserTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectUserTo);
  }

  // If client-side, fetch session between each navigation
  if (import.meta.client)
    await fetchSession();

  if (only && [ "user", "writer", "member", "admin" ].includes(only) && !loggedIn.value) {
    if (to.path === redirectGuestTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectGuestTo);
  }
});
