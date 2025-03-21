<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/public/svg/logo/LDAngledColoredText.svg">
    <source media="(prefers-color-scheme: light)" srcset="/public/svg/logo/LDAngledBlackText.svg">
    <img alt="Lungmen Dragons logo" src="/public/svg/logo/LDAngledColoredText.svg">
  </picture>

  <!-- [lungmendragons.com](https://www.lungmendragons.com)/ -->

</div>

# Lungmen Dragons Official Website

Lungmen Dragons are Arknights EN's most recognized competitive strategy group and community event organizer. This repository contains the source code for our website, a community resource for Arknights players. Built on Nuxt 3 (Vue + Vite + TypeScript), Naive UI, BetterAuth, and deployed to Cloudflare via NuxtHub. Secrets are managed with Infisical.

```sh
git clone https://github.com/lungmendragons/lungmendragons.com
cd lungmendragons
pnpm install
infisical login
infisical run --env=dev --path=/env -- pnpm run dev
```

## Infisical Secrets Management

Secrets can be exported as well.
```sh
infisical export --env=dev --path=/env --format=dotenv > .env
```

Cloudflare Workers & Pages secrets are managed and synced from the Infisical Cloudflare Pages native integration.

---

*Arknights* and *Arknights: Endfield* are registered trademarks of Shanghai Hypergryph Network Technology Co., Ltd. Copyright belongs to Hypergryph and/or its associates, including Yostar (Hong Kong) Limited. Images and data &copy; Hypergryph &copy; Yostar. Lungmen Dragons are not affiliated with or endorsed by Hypergryph or Yostar.
