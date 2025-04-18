import { defu } from "defu";
import { createAuthClient } from "better-auth/vue";
import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import type { RouteLocationRaw } from "vue-router";
import { userAdditionalFields } from "~~/shared/auth";

interface RuntimeAuthConfig {
  redirectUserTo: RouteLocationRaw | string;
  redirectGuestTo: RouteLocationRaw | string;
  redirectUnauthorizedTo: RouteLocationRaw | string;
};

export function useAuth() {
  const url = useRequestURL();
  const headers = import.meta.server ? useRequestHeaders() : undefined;

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers,
    },
    plugins: [
      adminClient(),
      usernameClient(),
      inferAdditionalFields({ user: userAdditionalFields }),
    ],
  });

  type Session = typeof client.$Infer.Session.session;
  type User = typeof client.$Infer.Session.user;

  const session = useState<Session | undefined>("auth:session", () => undefined);
  const user = useState<User | undefined>("auth:user", () => undefined);
  const sessionFetching = useState("auth:sessionFetching", () => false);

  const fetchSession = async () => {
    if (sessionFetching.value) return;
    sessionFetching.value = true;
    const { data } = await client.useSession(useFetch);
    session.value = data.value?.session;
    user.value = data.value?.user;
    sessionFetching.value = false;
    return data;
  };

  const options = defu(useRuntimeConfig().public.auth as Partial<RuntimeAuthConfig>, {
    redirectUserTo: "/profile",
    redirectGuestTo: "/signin",
    redirectUnauthorizedTo: "/401",
  });

  if (import.meta.client) {
    client.$store.listen("$sessionSignal", async (signal) => {
      if (!signal)
        return;
      await fetchSession();
    });
  };

  return {
    session,
    user,
    fetchSession,
    loggedIn: computed(() => !!session.value),
    async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
      const res = await client.signOut();
      if (redirectTo) {
        await navigateTo(redirectTo);
      }
      return res;
    },
    options,
    client,
  };
};
