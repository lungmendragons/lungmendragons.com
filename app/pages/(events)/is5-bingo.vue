<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { useThemeVars } from "naive-ui";
import type { GlobalThemeOverrides, ImageRenderToolbarProps } from "naive-ui";

const isMD = useMediaQuery(mediaQuery.minWidth.md as string);

const imageGroupThemeOverrides = computed(() => {
  const { popoverColor, boxShadow2, textColor2, borderRadius } = useThemeVars().value;
  const themeOverrides: NonNullable<GlobalThemeOverrides['Image']> = {
    toolbarColor: popoverColor,
    toolbarBoxShadow: boxShadow2,
    toolbarIconColor: textColor2,
    toolbarBorderRadius: borderRadius,
  };
  return themeOverrides;
});

function renderToolbar({ nodes }: ImageRenderToolbarProps) {
  return [
    nodes.prev,
    nodes.next,
    nodes.resizeToOriginalSize,
    nodes.zoomIn,
    nodes.zoomOut,
    nodes.close,
  ];
}

onMounted(() => {
  const el = document.getElementById("page-content-container");
  if (el) {
    el.style.backgroundImage = "url('/ld-events/bingo4/bg_zone_8.png')";
    el.style.backgroundPosition = "top";
    el.style.backgroundSize = "cover";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundBlendMode = "overlay";
  }
})

onUnmounted(() => {
  const el = document.getElementById("page-content-container");
  if (el) {
    el.style.backgroundImage = "unset";
    el.style.backgroundPosition = "unset";
    el.style.backgroundSize = "unset";
    el.style.backgroundRepeat = "unset";
    el.style.backgroundBlendMode = "unset";
  }
})

definePageMeta({
  getEmbedData: async () => {
    return {
      title: "Bingo Lockout #4 | Lungmen Dragons",
      description: "Bingo Lockout returns for Sarkaz's Furnaceside Fables. Sponsored by Arknights EN.",
      url: "https://lungmendragons.com/is5-bingo",
      image: {
        url: "https://lungmendragons.com/images/ld/bingo_logo.png",
        alt: "IS5 Bingo Lockout logo",
      }
    };
  },
});

useSeoMeta({
  title: "Bingo Lockout #4 | Lungmen Dragons",
  description: "Bingo Lockout returns for Sarkaz's Furnaceside Fables. Sponsored by Arknights EN.",
  ogTitle: "Bingo Lockout #4 | Lungmen Dragons",
  twitterTitle: "Bingo Lockout #4 | Lungmen Dragons",
  ogDescription: "Bingo Lockout returns for Sarkaz's Furnaceside Fables. Sponsored by Arknights EN.",
  twitterDescription: "Bingo Lockout returns for Sarkaz's Furnaceside Fables. Sponsored by Arknights EN.",
  ogUrl: "https://lungmendragons.com/is5-bingo",
  twitterCard: "summary",
  ogImage: {
    url: "https://lungmendragons.com/images/ld/bingo_logo.png",
    alt: "IS5 Bingo Lockout logo",
  },
  twitterImage: "https://lungmendragons.com/images/ld/bingo_logo.png",
});
</script>

<template>
  <NFlex
    vertical
    align="center">
    <img
      src="/ld-events/bingo4/bingo_logo.png"
      alt="IS5 Bingo Lockout logo"
      class="logo">
    <SVGSineWave
      :z="1"
      :scale="0.25"
      class="sine"
    /> 
    <div class="-mt-8 mx-4 mb-2 md:mb-0 text-xs lg:text-base text-center">
      <span>Bingo Lockout returns for Sarkaz's Furnaceside Fables.</span>
      <br>
      <span class="font-bold">Sponsored&nbsp;by&nbsp;Arknights&nbsp;EN.</span>
    </div>
    <NFlex class="mx-auto my-1 w-full">
      <NuxtLink
        class="mx-auto"
        to="https://www.youtube.com/@LungmenDragons"
        target="_blank">
        <NButton
          :size="isMD ? 'large' : 'medium'"
          type="primary"
          icon-placement="right"
          color="#F24242"
          style="color:white;">
          <template #icon>
            <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" style="filter:drop-shadow(0 2px 2px black)" />
          </template>
          <span class="font-bold" style="filter:drop-shadow(0 1px 2px black)">Watch on YouTube</span>
        </NButton>
      </NuxtLink>
    </NFlex>
    <NFlex
      vertical
      size="small"
      align="center"
      class="mx-auto">
      <span style="opacity: 75%; text-decoration-line: line-through;">
        Round of 64: 
        <NTime :time="1752562740" format="yyyy-MM-dd HH:mm O" unix />
        to
        <NTime :time="1753081140" format="yyyy-MM-dd HH:mm O" unix />
      </span>
      <BingoTimeSpan text="Day 1 (Round of 32):" :time="1753484400" />
      <BingoTimeSpan text="Day 2 (Round of 16):" :time="1753570800" />
      <BingoTimeSpan text="Day 3 (Quarter-finals):" :time="1754089200" />
      <BingoTimeSpan text="Day 4 (Semi-finals, Grand Final):" :time="1754175600" />
    </NFlex>
    <NCard class="w-fit mx-auto mt-2" size="small">
      <template #header>
        <div class="text-center text-xs font-normal">
          TOURNAMENT INFORMATION
        </div>
      </template>
      <template #action>
        <div class="text-center text-xs">
          Click on an image to zoom in.
        </div>
      </template>
      <NImageGroup
        :render-toolbar="renderToolbar"
        :theme-overrides="imageGroupThemeOverrides">
        <NGrid :cols="isMD ? 4 : 2">
          <NGi>
            <NImage
              src="/ld-events/bingo4/rules/Tournament Information.jpg"
              class="rules-img"
            />
          </NGi>
          <NGi>
            <NImage
              src="/ld-events/bingo4/rules/Tournament Information Bonus Points.jpg"
              class="rules-img"
            />
          </NGi>
          <NGi>
            <NImage
              src="/ld-events/bingo4/rules/Tournament Information Round Specific.jpg"
              class="rules-img"
            />
          </NGi>
          <NGi>
            <NImage
              src="/ld-events/bingo4/rules/Tournament Information Round Specific 2.jpg"
              class="rules-img"
            />
          </NGi>
        </NGrid>
      </NImageGroup>
    </NCard>
    <iframe
      src="https://challonge.com/is5bingo/module"
      width="100%"
      height="500"
      frameborder="0"
      scrolling="auto"
      allowtransparency="true"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      credentialless
    />
  </NFlex>
</template>

<style scoped>
/* :global(#page-content-container)  */
/* .is5-bg {
  position: absolute;
  width: 1000px;
  height: 1000px;
  background-image: url("/ld-events/bingo4/bg_zone_8.png");
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
} */
.logo {
  height: 300px;
  object-fit: contain;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.sine {
  height: 300px;
  top: 125px;
}
@media (max-width: 768px) {
  .logo {
    height: 150px;
  }
  .sine {
    height: 150px;
    top: 75px;
  }
}
.rules-img {
  width: 145px;
  height: 145px;
  object-fit: cover;
}
:global(.n-image-preview-toolbar .n-base-icon) {
  margin: 0 4px;
}
</style>
