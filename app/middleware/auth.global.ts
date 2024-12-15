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

const perms = {
  user: 1,
  writer: 2,
  member: 4,
  // unused: 8,
  // unused: 16,
  // unused: 32,
  // unused: 64,
  admin: 128,
};

// privilege hierarchy
// todo: more intuitive perms, this works for now
function hasPerm(value: number, perm: string) {
  // @ts-expect-error implicit any
  if (!perms[perm])
    return false;
  // @ts-expect-error implicit any
  return value & perms[perm];
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta?.auth === false)
    return;

  const { user, loggedIn, options, fetchSession } = useAuth();
  const { only, redirectUserTo, redirectGuestTo, redirectUnauthorizedTo } = defu(to.meta?.auth, options);

  if (only && only === "guest" && loggedIn.value) {
    if (to.path === redirectUserTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectUserTo);
  }

  // If client-side, fetch session between each navigation
  if (import.meta.client)
    await fetchSession();

  if (only && only !== "guest" && !loggedIn.value) {
    if (to.path === redirectGuestTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectGuestTo);
  }

  // @ts-expect-error prop permissions does not exist on type
  if (only && only !== "guest" && !hasPerm(user.value?.permissions, only)) {
    if (to.path === redirectUnauthorizedTo)
      return; // Avoid infinite redirect
    return navigateTo(redirectUnauthorizedTo ?? "/401");
  }
});
