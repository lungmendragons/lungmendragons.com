<script setup lang="ts">
useSeoMeta({
  title: "Lungmen Dragons",
  description:
    "Arknights EN's most recognized competitive strategy group and community event organizer. " +
    "See the highest level of skill Terra has to offer.",
  ogTitle: "Lungmen Dragons",
  ogUrl: "https://lungmendragons.com",
  ogDescription:
    "Arknights EN's most recognized competitive strategy group and community event organizer. " +
    "See the highest level of skill Terra has to offer.",
  ogImage: {
    url: "https://lungmendragons.com/og/logo-card-large.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Lungmen Dragons logo, with blue and red accent colors, displayed on a solid black background.",
  },
  twitterCard: "summary_large_image",
  twitterTitle: "Lungmen Dragons",
  twitterDescription:
    "Arknights EN's most recognized competitive strategy group and community event organizer. " +
    "See the highest level of skill Terra has to offer.",
  twitterImage: "https://lungmendragons.com/og/logo-card-large.png",
  twitterImageAlt: "Lungmen Dragons logo, with blue and red accent colors, displayed on a solid black background.",
  twitterSite: "@LungmenDragons",
  twitterCreator: "@LungmenDragons",
  colorScheme: "dark light",
  themeColor: [
    { content: "#1E1E20", media: "(prefers-color-scheme: dark)" },
    { content: "#FFFFFF", media: "(prefers-color-scheme: light)" },
  ],
});

const route = useRoute();

if(route.meta.getEmbedData && import.meta.server) {
  try {
    const { title, description, url } = await route.meta.getEmbedData();
    useSeoMeta({
      title,
      ogTitle: title,
      twitterTitle: title,
      description,
      ogDescription: description,
      twitterDescription: description,
      ogUrl: url,
      twitterCard: "summary",
    })
  } catch {
    
  }
}

import { theme, themeOverrides } from "~/utils/theme";
import LoadingDotsAnim from "~/components/SVG/LoadingDotsAnim.vue";
import LogoColorIcon from "~/components/Logo/ColorIcon.vue";
import { useFavicon, useMediaQuery, useDark } from "@vueuse/core";
// import { NThemeEditor } from "naive-ui";

const subdomain = useSubdomain();
const isDark = useDark();
const favicon = computed(() => isDark.value ? "/svg/logo/LDAngledColored.svg" : "/svg/logo/LDAngledBlack.svg");
useFavicon(favicon);

const isLG = useMediaQuery(mediaQuery.minWidth.lg as string);
const layout = computed(() => {
  const layout = useRoute().meta.layout;
  if (layout) {
    return layout;
  } else  {
    return isLG.value ? "desktop" : "mobile";
  }
});
const isLoaded = ref(false);

onMounted(() => {
  isLoaded.value = true;
  if (subdomain.value) document.body.style.all = "unset";
});
</script>

<template>
  <NConfigProvider
    :theme="layout !== 'empty' ? theme : null"
    :theme-overrides="layout !== 'empty' ? themeOverrides : null">
    <NuxtRouteAnnouncer />
    <NGlobalStyle />

    <!--
      The use functions for these are all auto-imported via nuxt config.
      const notification = useNotification();
      notification.create({ ... });
    -->
    <NDialogProvider>
    <NLoadingBarProvider>
    <NMessageProvider>
    <NModalProvider>
    <NNotificationProvider to="#page-content-container">

    <!--
      Deferring content with a loading screen until app mounted avoids annoying FOUC problems
      From what I can tell it's also significantly faster. like minimum 5x faster
    -->
    <ClientOnly>
      <!-- <NThemeEditor> -->
      <NuxtLayout :name="layout">
        <NuxtPage />
      </NuxtLayout>
      <!-- </NThemeEditor> -->
    </ClientOnly>

    <!-- Loading screen during hydration, shouldn't exceed ~500ms or so -->
    <NFlex
      v-if="!isLoaded && layout !== 'empty'"
      vertical
      justify="center"
      :style="{ width: '100vw', height: '100svh' }">
      <LogoColorIcon :style="{ width: 72, height: 72, margin: '12px auto' }" />
      <LoadingDotsAnim :style="{ width: 24, height: 24, margin: '0 auto' }" />
    </NFlex>

    </NNotificationProvider>
    </NModalProvider>
    </NMessageProvider>
    </NLoadingBarProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
