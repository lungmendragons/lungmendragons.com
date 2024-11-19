<script setup lang="ts">
import type { MenuInst } from "naive-ui";
import { NButton, useThemeVars } from "naive-ui";
import { useMediaQuery } from "@vueuse/core";

import Socials from "./Socials.vue";
import { sidebarMenu } from "~/utils/menu";

import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import MdiHeart from "~icons/mdi/heart";

const { drawer = false } = defineProps<{ drawer?: boolean }>();
const isMD = useMediaQuery("(min-width: 768px)");
const themeVars = useThemeVars();
const route = useRoute(); // nuxt

const menuInst = ref<MenuInst | null>(null);
const selectedKey = ref<string | null>(null);

onBeforeMount(() => {
  /* route.name needs to be identical to corresponding key in menu.ts
     if not, nothing is highlighted - not a problem but makes for better UX
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
      padding: isMD ? '12px' : '0',
      backgroundColor: drawer ? '' : themeVars.cardColor,
    }">
    <NMenu
      ref="menuInst"
      v-model:value="selectedKey"
      :options="sidebarMenu"
      :root-indent="18"
      :indent="12"
      responsive
      accordion
    />
    <NFlex vertical style="margin: 0.5rem">
      <Socials class="p-2" />
      <NButton
        strong
        round
        tag="a"
        href="https://ko-fi.com/lungmendragons"
        target="_blank"
        rel="noopener noreferrer"
        type="primary"
        :style="{
          width: '100%',
          margin: '0.125rem 0',
        }">
        <template #icon>
          <NIcon>
            <MdiHeart />
          </NIcon>
        </template>
        Support us
      </NButton>
      <NButton
        strong
        round
        tag="a"
        href="https://www.youtube.com/@LungmenDragons/join"
        target="_blank"
        rel="noopener noreferrer"
        color="#E23232"
        :style="{
          width: '100%',
          margin: '0.125rem 0',
        }">
        <template #icon>
          <NIcon>
            <Fa6BrandsYoutube />
          </NIcon>
        </template>
        YouTube Membership
      </NButton>
    </NFlex>
  </NFlex>
</template>
