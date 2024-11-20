<script setup lang="ts">
import type { CSSProperties } from "vue";
import { useDark } from "@vueuse/core";
import LogoColorIcon from "./ColorIcon.vue";
import LogoBlackIcon from "./BlackIcon.vue";

const { style } = defineProps<{ style?: CSSProperties }>();
const isDark = useDark();
</script>

<template>
  <component
    :is="isDark ? LogoColorIcon : LogoBlackIcon"
    :width="style?.width"
    :height="style?.height"
    :style="style"
  />
</template>
