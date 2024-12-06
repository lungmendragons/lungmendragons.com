<script setup lang="ts">
import Link from "~/components/Link.global.vue";
// Link is supposed to be auto-imported by nuxt automatically I don't understand why it isn't

import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import Fa6BrandsBilibili from "~icons/fa6-brands/bilibili";
import Fa6BrandsDiscord from "~icons/fa6-brands/discord";
import Fa6BrandsBluesky from "~icons/fa6-brands/bluesky";
import Fa6BrandsXTwitter from "~icons/fa6-brands/x-twitter";
// import Fa6BrandsSquareFacebook from "~icons/fa6-brands/square-facebook";
import Fa6BrandsRedditAlien from "~icons/fa6-brands/reddit-alien";

const props = defineProps<{
  youtube: string;
  bilibili: string;
  discord: string;
  bluesky: string;
  twitter: string;
  reddit: string;
}>();

function socialIsPresent(social: string | undefined) {
  return social && social !== "" && social !== "none";
}
</script>

<template>
  <NFlex justify="start" align="center">
    <Link v-if="socialIsPresent(props.youtube)" :to="props.youtube">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text>
            <NIcon>
              <Fa6BrandsYoutube />
            </NIcon>
          </NButton>
        </template>
        YouTube
      </NTooltip>
    </Link>
    <Link v-if="socialIsPresent(props.bilibili)" :to="props.bilibili">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text>
            <NIcon>
              <Fa6BrandsBilibili />
            </NIcon>
          </NButton>
        </template>
        Bilibili
      </NTooltip>
    </Link>
    <Link v-if="socialIsPresent(props.discord)" :to="props.discord">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text>
            <NIcon>
              <Fa6BrandsDiscord />
            </NIcon>
          </NButton>
        </template>
        Discord
      </NTooltip>
    </Link>
    <Link v-if="socialIsPresent(props.bluesky)" :to="props.bluesky">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text>
            <NIcon>
              <Fa6BrandsBluesky />
            </NIcon>
          </NButton>
        </template>
        Bluesky
      </NTooltip>
    </Link>
    <Link v-if="socialIsPresent(props.twitter)" :to="props.twitter">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text>
            <NIcon>
              <Fa6BrandsXTwitter />
            </NIcon>
          </NButton>
        </template>
        Twitter/X
      </NTooltip>
    </Link>
    <Link v-if="socialIsPresent(props.reddit)" :to="props.reddit">
      <NTooltip trigger="hover">
        <template #trigger>
          <NButton text>
            <NIcon>
              <Fa6BrandsRedditAlien />
            </NIcon>
          </NButton>
        </template>
        Reddit
      </NTooltip>
    </Link>
  </NFlex>
</template>
