import { betterAuth, type BetterAuthOptions } from "better-auth";
import { D1Dialect } from "kysely-d1";
import { admin, username } from "better-auth/plugins";

const skipRateLimitPaths = new Set([
  "/get-session",
  "/list-session",
  "/ok",
  "/error",
]);

const skipRateLimiting = (key: string) => {
  const parts = key.split("/", 1);
  if (parts.length < 2) {
    return false;
  } else {
    return skipRateLimitPaths.has(parts[1]);
  }
};

const options = {
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300,
    }
  },
  user: {
    additionalFields: {
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
  },
  secondaryStorage: {
    get: async key => await useKV().get<string>(`auth:session:${key}`),
    set: async (key, value, ttl) => {
      return await useKV().set(`auth:session:${key}`, value, { ttl });
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

let _auth: ReturnType<typeof betterAuth>;
export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: {
        dialect: new D1Dialect({
          database: useDB(),
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
