import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
// import { cjsInterop } from "vite-plugin-cjs-interop";
import IconsResolver from "unplugin-icons/resolver";

const isProd = process.env.NODE_ENV === "production";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-06",
  future: {
    /* Nuxt 4 pre-release opt-in. Doing this now saves the bullshit of migrating to v4 later.
       Most significant change is the new directory structure, which is already implemented.
       See: https://github.com/nuxt/nuxt/issues/26444
            https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4 */
    compatibilityVersion: 4,
  },
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "nuxtjs-naive-ui",
    "nuxt-gtag",
    "nuxt-security",
    "@pinia/nuxt",
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  hub: {
    database: true,
    kv: true,
    blob: true,
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    experimental: {
      tasks: true,
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
        ],
        "frame-src": [
          "https://www.youtube.com/embed/", // for bingo3
          "https://stripedypaper.github.io/ak-guesser/", // for guesser
        ],
        "img-src": [
          "'self'",
          "blob:",
          "data:",
          "https:",
        ],
        "media-src": [
          "'self'",
          "blob:",
          "https:",
        ],
        "script-src": [
          "'strict-dynamic'",
          "'nonce-{{nonce}}'", // generated automatically with nonce: true setting above
        ],
        "style-src": [
          "'self'",
          /* Nuxt apps use a LOT of inline styles (including ours) and trying to configure the CSP
             to allow them without 'unsafe-inline' would be a waste of time. As per the docs:
                "Allowing 'unsafe-inline' for styles is widely considered as acceptable. Known exploits
                are not common and center around the injection of image urls in CSS. This risk can be
                eliminated if you set the img-src policy properly."
             https://nuxt-security.vercel.app/documentation/advanced/strict-csp#strict-dynamic-csp-level-3 */
          "'unsafe-inline'",
        ],
      },
      crossOriginEmbedderPolicy: isProd ? "credentialless" : false,
      strictTransportSecurity: {
        // 2 years is recommended:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security#examples
        maxAge: 63072000,
        includeSubdomains: true,
        preload: true,
      },
    },
  },
  pinia: {
    storesDirs: [ "./app/stores/**" ],
  },
  vite: {
    plugins: [
      Icons({
        compiler: "vue3",
      }),
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
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
});
