import { defu } from "defu";
import { AuthPermission, hasPermission } from "~~/shared/auth";

type MiddlewareOptions = false | {
  only?: AuthPermission;
  redirectUserTo?: string;
  redirectGuestTo?: string;
  redirectUnauthorizedTo?: string;
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

  const { options, fetchSession, user, loggedIn } = useAuth();
  const { only, redirectUserTo, redirectGuestTo, redirectUnauthorizedTo } = defu(to.meta?.auth, options);

  if (only === AuthPermission.Guest && loggedIn.value) {
    if (to.path === redirectUserTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectUserTo);
  }

  // If client-side, fetch session between each navigation
  if (import.meta.client)
    await fetchSession();

  if (only && !loggedIn.value) {
    if (to.path === redirectGuestTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectGuestTo);
  }

  if (
    only &&
    user.value &&
    !hasPermission(user.value.permissions, only)
  ) {
    if (to.path === redirectUnauthorizedTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectUnauthorizedTo ?? "/401");
  }
});
