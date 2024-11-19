<script setup lang="ts">
import type { Clue } from "~/utils/events-archive/anni3-clues";
import { isDark } from "~/utils/theme";
import { h, type VNode } from "vue";
// import { useDark } from "@vueuse/core";
import { NImage } from "naive-ui";

const props = defineProps<Clue>();
// const isDark = useDark();

function cipherSplit(str: string): string {
  const space = 8;
  return str.length < space
    ? str
    : `${str.slice(0, space)}\u200B${cipherSplit(str.slice(space))}`;
};

function renderImage(src: string): () => VNode {
  return (): VNode => h(
    NImage,
    {
      lazy: true,
      objectFit: "contain",
      class: "mx-auto max-h-[60vh] justify-center",
      src,
      imgProps: {
        style: {
          filter: props.invert && !isDark.value
            ? "invert(1) hue-rotate(180deg) brightness(226%)"
            : "",
        },
      },
    },
  );
}
</script>

<template>
  <NFlex vertical>
    <template v-if="props.assets.cipher">
      <div class="text-center text-balance">
        {{ cipherSplit(props.assets.cipher) }}
      </div>
    </template>
    <template v-if="props.assets.url">
      <NuxtLink
        class="
          text-center
          font-bold
          hover:underline
          text-blue-400"
        :href="props.assets.url.href"
        target="_blank"
      >
        {{ props.assets.url.text }}
      </NuxtLink>
    </template>
    <template v-if="props.assets.img">
      <component :is="renderImage(`/ld-events/anni3/${props.assets.img}`)" />
    </template>
    <template v-if="props.assets.audio">
      <audio controls>
        <source :src="`/ld-events/anni3/${props.assets.audio}`">
      </audio>
    </template>
  </NFlex>
</template>
