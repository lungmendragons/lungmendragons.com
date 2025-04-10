<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { renderImgComponent } from "~/utils/gachasim";
import type { RollResult } from "rs-app";

const { preload } = defineProps<{ preload: RollResult[] }>();

const isMD = useMediaQuery(mediaQuery.minWidth.md);
</script>

<template>
  <div>
    <component
      v-for="c in preload"
      :key="c.character"
      v-show="false"
      :is="renderImgComponent(c, isMD)"
    />
  </div>
</template>