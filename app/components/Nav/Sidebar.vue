<script setup lang="ts">
import type { MenuInst } from "naive-ui";
import { NButton, useThemeVars } from "naive-ui";
import { useMediaQuery } from "@vueuse/core";

import Socials from "./Socials.vue";
import { getSidebarMenu } from "~/utils/menu";

import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import MdiHeart from "~icons/mdi/heart";

const { drawer = false } = defineProps<{ drawer?: boolean }>();
const { user } = useAuth();
const isMD = useMediaQuery(mediaQuery.minWidth.md);
const isLG = useMediaQuery(mediaQuery.minWidth.lg);
const showSocials = useMediaQuery(mediaQuery.minHeight.md);
const themeVars = useThemeVars();
const route = useRoute(); // nuxt

const menuInst = ref<MenuInst | null>(null);
const selectedKey = ref<string | null>(null);

onBeforeMount(() => {
  /* route.name needs to be identical to corresponding key in menu.ts
     if not, nothing is highlighted (not breaking but makes for better UX)
     e.g. at lungmendragons.com/guides, route.name = "guides" */
  selectedKey.value = route.name as string;
  menuInst.value?.showOption(route.name as string);
});
</script>

<template>
  <NFlex
    vertical
    justify="space-between"
    :style="{
      height: '100%',
      overflow: isMD ? 'auto' : 'hidden',
      padding: isLG ? '12px' : '0',
      backgroundColor: drawer ? '' : themeVars.cardColor,
    }">
    <NScrollbar>
      <!-- @vue-expect-error prop "permissions" does not exist -->
      <NMenu
        ref="menuInst"
        v-model:value="selectedKey"
        :options="getSidebarMenu(drawer, user?.permissions)"
        :root-indent="18"
        :indent="12"
        responsive
        accordion
      />
    </NScrollbar>
    <NFlex vertical style="margin: 0.5rem">
      <Socials v-if="showSocials" class="p-2" />
      <NFlex justify="space-around" :vertical="isLG">
        <NButton
          :size="isMD && showSocials ? 'medium' : 'tiny'"
          strong
          round
          tag="a"
          href="https://ko-fi.com/lungmendragons"
          target="_blank"
          rel="noopener noreferrer"
          type="primary"
          class="w-[40%] lg:w-full text-[0.7rem] md:text-sm">
          <template #icon>
            <NIcon :size="isMD ? 18 : 12">
              <MdiHeart />
            </NIcon>
          </template>
          Support
        </NButton>
        <NButton
          :size="isMD && showSocials ? 'medium' : 'tiny'"
          strong
          round
          tag="a"
          href="https://www.youtube.com/@LungmenDragons/join"
          target="_blank"
          rel="noopener noreferrer"
          color="#E23232"
          class="w-[50%] lg:w-full text-[0.7rem] md:text-sm">
          <template #icon>
            <NIcon :size="isMD ? 18 : 12">
              <Fa6BrandsYoutube />
            </NIcon>
          </template>
          Membership
        </NButton>
      </NFlex>
    </NFlex>
  </NFlex>
</template>
