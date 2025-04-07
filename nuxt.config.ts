import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import wasm from "vite-plugin-wasm";
import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-07",
  future: {
    /* Nuxt 4 pre-release opt-in. Doing this now saves the bullshit of migrating to v4 later.
       Most significant change is the new directory structure, which is already implemented.
       See: https://github.com/nuxt/nuxt/issues/26444
            https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4 */
    compatibilityVersion: 4,
  },
  modules: [
    "nitro-cloudflare-dev",
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "nuxtjs-naive-ui",
    "nuxt-gtag",
    "nuxt-security",
    "@pinia/nuxt",
  ],
  devtools: {
    enabled: true,
    componentInspector: false,
  },
  build: {
    transpile: [ "vueuc", "naive-ui" ],
  },
  hub: {
    database: true,
    kv: true,
    blob: true,
    cache: true,
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    // These straight up do not work but will be useful if they ever do.
    // scheduledTasks: {
    //   "*/5 * * * *": [ "gsheet", "yt-recent" ],
    // },
    experimental: {
      // tasks: true,
      openAPI: true,
    },
  },
  security: {
    nonce: true,
    rateLimiter: {
      driver: {
        name: "cloudflareKVBinding",
        options: {
          binding: "KV",
        },
      },
    },
    headers: {
      contentSecurityPolicy: {
        // defaults: https://nuxt-security.vercel.app/documentation/headers/csp#default-value
        "font-src": [
          "'self'",
          "data:",
        ],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https:",
        ],
        "script-src": [
          "'wasm-unsafe-eval'", // required to be able to run wasm code
          "'strict-dynamic'",
          "'nonce-{{nonce}}'", // generated automatically
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
        ],
      },
      crossOriginEmbedderPolicy:
        // unsafe-none is required for youtube embeds to load on firefox/safari
        "unsafe-none",
      strictTransportSecurity: {
        // 2 years is recommended:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security#examples
        maxAge: 63072000,
        includeSubdomains: true,
        preload: true,
      },
    },
  },
  routeRules: {
    // These are required for iframes to load on Firefox and Safari.
    // Chromium browsers (Chrome/Edge/Opera/Samsung) only need crossOriginEmbedderPolicy: "credentialless".
    // See https://developer.mozilla.org/en-US/docs/Web/Security/IFrame_credentialless
    // I exclusively use Firefox (desktop) and Safari (phone) so I won't accept any solution that excludes those. - Tobo
    "/guesser": {
      security: {
        headers: {
          crossOriginEmbedderPolicy: "unsafe-none",
        },
      },
    },
    "/bingo3": {
      security: {
        headers: {
          crossOriginEmbedderPolicy: "unsafe-none",
        },
      },
    },
  },
  pinia: {
    storesDirs: [ "./app/stores/**" ],
  },
  vite: {
    esbuild: {
      supported: {
        "top-level-await": true,
      },
    },
    // optimizeDeps: {
    //   esbuildOptions: {
    //     target: "esnext",
    //   }
    // },
    // build: {
    //   target: "esnext",
    // },
    plugins: [
      Icons({
        compiler: "vue3",
      }),
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useLoadingBar",
              "useMessage",
              "useModal",
              "useNotification",
            ],
          },
        ],
      }),
      Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver(),
        ],
      }),
      wasm(),
      // Note: At least on my machine, I need this enabled during development to avoid errors, but
      // it causes an error at build time, so I have to comment it out before deploying. No idea why.
      // cjsInterop({
      //   dependencies: [
      //     "vueuc", // dependency of naive-ui
      //   ],
      // }),
    ],
  },
  typescript: {
    shim: true,
    tsConfig: {
      compilerOptions: {
        types: [
          "unplugin-icons/types/vue",
        ],
      },
    },
  },
  alias: {
    "rs-app": fileURLToPath(new URL("./rs-app/src/lib.ts", import.meta.url)),
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: [
    "~/assets/css/fonts.css",
  ],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    config: {
      darkMode: [ "selector", `[class*="dark"]` ],
      theme: {
        extend: {
          screens: {
            min: "360px",
            xs: "432px",
            sm: "576px",
          },
        },
      },
    },
  },
  image: {
    screens: {
      "xs": 432,
      "sm": 576,
    },
  },
});
