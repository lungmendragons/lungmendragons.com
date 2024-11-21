<script setup lang="ts">
import Link from "~/components/Link.global.vue";
// Link is supposed to be auto-imported by nuxt automatically I don't understand why it isn't

import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import Fa6BrandsBilibili from "~icons/fa6-brands/bilibili";
import Fa6BrandsDiscord from "~icons/fa6-brands/discord";
import Fa6BrandsBluesky from "~icons/fa6-brands/bluesky";
import Fa6BrandsXTwitter from "~icons/fa6-brands/x-twitter";
import Fa6BrandsSquareFacebook from "~icons/fa6-brands/square-facebook";
</script>

<template>
  <NFlex justify="space-between" align="center">
    <Link to="https://www.youtube.com/@LungmenDragons">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text class="text-xl">
            <NIcon>
              <Fa6BrandsYoutube />
            </NIcon>
          </NButton>
        </template>
        YouTube
      </NTooltip>
    </Link>
    <Link to="https://space.bilibili.com/1106931562">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text class="text-xl">
            <NIcon>
              <Fa6BrandsBilibili />
            </NIcon>
          </NButton>
        </template>
        Bilibili
      </NTooltip>
    </Link>
    <Link to="https://discord.gg/lungmendragons">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text class="text-xl">
            <NIcon>
              <Fa6BrandsDiscord />
            </NIcon>
          </NButton>
        </template>
        Discord
      </NTooltip>
    </Link>
    <Link to="https://bsky.app/profile/lungmendragons.com">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text class="text-xl">
            <NIcon>
              <Fa6BrandsBluesky />
            </NIcon>
          </NButton>
        </template>
        Bluesky
      </NTooltip>
    </Link>
    <Link to="https://x.com/LungmenDragons">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text class="text-xl">
            <NIcon>
              <Fa6BrandsXTwitter />
            </NIcon>
          </NButton>
        </template>
        Twitter/X
      </NTooltip>
    </Link>
    <Link to="https://www.facebook.com/OfficialLungmenDragons">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text class="text-xl">
            <NIcon>
              <Fa6BrandsSquareFacebook />
            </NIcon>
          </NButton>
        </template>
        Facebook
      </NTooltip>
    </Link>
  </NFlex>
</template>
