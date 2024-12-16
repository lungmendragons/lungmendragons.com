<script setup lang="ts">
useSeoMeta({
  title: "Lungmen Dragons",
  description:
    "Arknights EN's most reputable competitive strategy group and community event organiser. " +
    "See the highest level of skill Terra has to offer.",
  ogTitle: "Lungmen Dragons",
  ogUrl: "https://www.lungmendragons.com",
  ogDescription:
    "Arknights EN's most reputable competitive strategy group and community event organiser. " +
    "See the highest level of skill Terra has to offer.",
  ogImage: {
    url: "https://www.lungmendragons.com/og/logo-card-large.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Lungmen Dragons logo, with blue and red accent colors, displayed on a solid black background.",
  },
  twitterCard: "summary_large_image",
  twitterTitle: "Lungmen Dragons",
  twitterDescription:
    "Arknights EN's most reputable competitive strategy group and community event organiser. " +
    "See the highest level of skill Terra has to offer.",
  twitterImage: "https://www.lungmendragons.com/og/logo-card-large.png",
  twitterImageAlt: "Lungmen Dragons logo, with blue and red accent colors, displayed on a solid black background.",
  twitterSite: "@LungmenDragons",
  twitterCreator: "@LungmenDragons",
  colorScheme: "dark light",
  themeColor: [
    { content: "#1E1E20", media: "(prefers-color-scheme: dark)" },
    { content: "#FFFFFF", media: "(prefers-color-scheme: light)" },
  ],
});

import { theme, themeOverrides } from "~/utils/theme";
import LoadingDotsAnim from "~/components/SVG/LoadingDotsAnim.vue";
import LogoColorIcon from "~/components/Logo/ColorIcon.vue";
import { useFavicon, useMediaQuery, useDark } from "@vueuse/core";

const isDark = useDark();
const favicon = computed(() => isDark.value ? "/svg/logo/LDAngledColored.svg" : "/svg/logo/LDAngledBlack.svg");
useFavicon(favicon);

const isLG = useMediaQuery(mediaQuery.minWidth.lg as string);
const layout = computed(() => isLG.value ? "desktop" : "mobile");
const isLoaded = ref(false);

onMounted(() => isLoaded.value = true);
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides">
    <NuxtRouteAnnouncer />
    <NGlobalStyle />

    <!--
      The use functions for these are all auto-imported via nuxt config.
      const notification = useNotification();
      notification.create({ ... });
    -->
    <NDialogProvider>
    <NLoadingBarProvider>
    <NModalProvider>
    <NMessageProvider>
    <NNotificationProvider>

    <main data-allow-mismatch="children" />

    <!--
      Deferring content with a loading screen until app mounted avoids annoying FOUC problems
      From what I can tell it's also significantly faster. like minimum 5x faster
    -->
    <Teleport defer to="main">
      <NuxtLayout :name="layout">
        <NuxtPage />
      </NuxtLayout>
    </Teleport>

    <!-- Loading screen during hydration, shouldn't exceed ~500ms or so -->
    <Teleport to="main" :disabled="isLoaded">
      <NFlex
        vertical
        justify="center"
        :style="{ width: '100vw', height: '100svh' }">
        <LogoColorIcon :style="{ width: 72, height: 72, margin: '12px auto' }" />
        <LoadingDotsAnim :style="{ width: 24, height: 24, margin: '0 auto' }" />
      </NFlex>
    </Teleport>

    </NNotificationProvider>
    </NMessageProvider>
    </NModalProvider>
    </NLoadingBarProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
