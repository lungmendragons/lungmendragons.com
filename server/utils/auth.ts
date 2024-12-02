import { betterAuth } from "better-auth";
import { D1Dialect } from "@atinux/kysely-d1";
import { admin } from "better-auth/plugins";

let _auth: ReturnType<typeof betterAuth>;
export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: {
        dialect: new D1Dialect({
          database: hubDatabase(),
        }),
        type: "sqlite",
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
          },
        },
      },
      secondaryStorage: {
        get: key => hubKV().getItemRaw(`_auth:${key}`),
        set: (key, value, ttl) => {
          return hubKV().set(`_auth:${key}`, value, { ttl });
        },
        delete: key => hubKV().del(`_auth:${key}`),
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
      ],
    });
  }
  return _auth;
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL;
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin;
    } catch {} // (e) {}
  }
  return baseURL;
}
