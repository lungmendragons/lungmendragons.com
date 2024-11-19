<script setup lang="ts">
import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import Fa6BrandsBilibili from "~icons/fa6-brands/bilibili";
import Fa6BrandsDiscord from "~icons/fa6-brands/discord";
import Fa6BrandsBluesky from "~icons/fa6-brands/bluesky";
import Fa6BrandsXTwitter from "~icons/fa6-brands/x-twitter";
import Fa6BrandsSquareFacebook from "~icons/fa6-brands/square-facebook";
</script>

<template>
  <NFlex justify="space-between" align="center">
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          text
          href="https://www.youtube.com/@LungmenDragons"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl">
          <NIcon>
            <Fa6BrandsYoutube />
          </NIcon>
        </NButton>
      </template>
      YouTube
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          text
          href="https://space.bilibili.com/1106931562"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl">
          <NIcon>
            <Fa6BrandsBilibili />
          </NIcon>
        </NButton>
      </template>
      Bilibili
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          text
          href="https://discord.gg/lungmendragons"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl">
          <NIcon>
            <Fa6BrandsDiscord />
          </NIcon>
        </NButton>
      </template>
      Discord
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          text
          href="https://bsky.app/profile/lungmendragons.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl">
          <NIcon>
            <Fa6BrandsBluesky />
          </NIcon>
        </NButton>
      </template>
      Bluesky
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          text
          href="https://x.com/LungmenDragons"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl">
          <NIcon>
            <Fa6BrandsXTwitter />
          </NIcon>
        </NButton>
      </template>
      Twitter/X
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          text
          href="https://www.facebook.com/OfficialLungmenDragons"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl">
          <NIcon>
            <Fa6BrandsSquareFacebook />
          </NIcon>
        </NButton>
      </template>
      Facebook
    </NTooltip>
  </NFlex>
</template>
