import { defu } from "defu";
import { createAuthClient } from "better-auth/vue";
import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins";
import type { RouteLocationRaw } from "vue-router";

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
      inferAdditionalFields({
        user: {
          permissions: {
            type: "number",
            required: true,
            defaultValue: 1,
            input: false,
          },
          flair: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
          youtube: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
          bilibili: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
          discord: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
          bluesky: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
          twitter: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
          reddit: {
            type: "string",
            defaultValue: "none",
            input: false,
          },
        },
      }),
    ],
  });

  const options = defu(useRuntimeConfig().public.auth as Partial<RuntimeAuthConfig>, {
    redirectUserTo: "/profile",
    redirectGuestTo: "/signin",
    redirectUnauthorizedTo: "/401",
  });

  if (import.meta.client) {
    client.$store.listen("$sessionSignal", async (signal) => {
      if (!signal)
        return;
      await client.useSession(useFetch);
    });
  };

  return {
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
