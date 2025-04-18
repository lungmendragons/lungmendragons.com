import { betterAuth, type BetterAuthOptions } from "better-auth";
import { Kysely } from "kysely";
import { admin, username } from "better-auth/plugins";
import { D1Dialect } from "./kysely-d1";
import { H3Event } from "h3";
import { AuthPermission, hasPermission, userAdditionalFields } from "~~/shared/auth";
export { AuthPermission } from "~~/shared/auth";

const options = {
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300,
    }
  },
  user: {
    additionalFields: userAdditionalFields,
  },
  secondaryStorage: {
    get: async key => useKV().getItemRaw(`auth:session:${key}`),
    set: async (key, value, ttl) => {
      return await useKV().setItemRaw(
        `auth:session:${key}`,
        // this test is done just in case. the type of `value` is string so it should
        // be correct, but if its some other type of object it can cause serious problems.
        typeof value === "string" ? value : JSON.stringify(value),
        { ttl }
      );
    },
    delete: async key => await useKV().del(`auth:session:${key}`),
  },
  rateLimit: {
    // skip rate limiting certain auth endpoints. this is already done by `nuxt-security`
    // using an LRU cache, which avoids hitting the KV store.
    // customStorage: {
    //   get: async key => {
    //     if (!skipRateLimiting(key)) {
    //       return (await useKV().get<any>(`auth:rate-limit:${key}`));
    //     } else {
    //       return undefined;
    //     };
    //   },
    //   set: async (key, value) => {
    //     if (!skipRateLimiting(key)) {
    //       await useKV().set(`auth:rate-limit:${key}`, JSON.stringify(value), { ttl: 3600 });
    //     }
    //   }
    // },
    enabled: false,
  },
  baseURL: getBaseURL(),
  emailAndPassword: {
    enabled: true,
  },
  // maybe todo: google, apple, discord
  // socialProviders: {
  //   //
  // },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    admin(),
    username(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
} satisfies BetterAuthOptions;

export type ServerAuth = ReturnType<typeof betterAuth<typeof options>>;

let _auth: ServerAuth;
export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: {
        db: new Kysely({
          dialect: new D1Dialect({
            database: useDB(),
          }),
        }),
        type: "sqlite",
      },
      ...options,
    });
  }
  return _auth;
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL;
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin;
    } catch { } // (e) {}
  }
  return baseURL;
}

export const requirePermission = (
  allow: Exclude<AuthPermission, AuthPermission.Guest>,
  other?: (event: H3Event) => boolean,
) => async (event: H3Event) => {

  const headers = event.headers;
  const session = await serverAuth().api.getSession({
    headers: headers,
  });
  if (session === null || !hasPermission(session.user.permissions, allow)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  event.context.auth = session;

  if (other && !other(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
};

declare module "h3" {
  interface H3EventContext {
    auth?: ServerAuth["$Infer"]["Session"],
  }
}