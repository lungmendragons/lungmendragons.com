// @ts-check
import antfu from "@antfu/eslint-config";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    ignores: [
      ".nuxt/**",
      ".output/**",
      "node_modules/**",
      "**/*.md",
      "app/app.vue",
      "app/components/SVG/**",
    ],
  }, {
    // https://github.com/antfu/eslint-config?tab=readme-ov-file#plugins-renaming
    // https://github.com/antfu/eslint-config/tree/main/src/configs
    rules: {
      // https://eslint.org/docs/latest/rules/
      "no-case-declarations": [ "off" ],
      "no-console": [ "off" ],
      "unused-imports/no-unused-vars": [ "off" ], // ts rule covers this

      "import/consistent-type-specifier-style": [ "off" ],

      "node/prefer-global/process": [ "off" ],

      // https://perfectionist.dev/rules
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-named-exports": "off",

      // https://eslint.style/rules
      "style/array-bracket-spacing": [ "warn", "always" ],
      "style/brace-style": [ "error", "1tbs" ],
      "style/member-delimiter-style": [ "warn", {
        multiline: { delimiter: "semi" },
        singleline: { delimiter: "semi" },
      } ],
      "style/quotes": [ "error", "double", { allowTemplateLiterals: true } ],
      "style/semi": [ "error", "always" ],

      // https://typescript-eslint.io/rules/
      "ts/no-unused-vars": [
        "warn",
        {
          args: "none",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "ts/consistent-type-definitions": [ "off" ],
      // "ts/no-floating-promises": [ "warn" ],
      "ts/prefer-literal-enum-member": [ "off" ],

      // https://eslint.vuejs.org/rules/
      "vue/first-attribute-linebreak": [ "off" ],
      "vue/html-closing-bracket-newline": [ "off" ],
      "vue/max-attributes-per-line": [ "warn", {
        singleline: { max: 2 },
        multiline: { max: 1 },
      } ],
      "vue/prefer-separate-static-class": "off",
    },
  }),
);
