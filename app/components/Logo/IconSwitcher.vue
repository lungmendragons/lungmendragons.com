<script setup lang="ts">
import type { Component, CSSProperties } from "vue";
import { useDark } from "@vueuse/core";
import LogoColorIcon from "~/components/SVG/LogoColorIcon_.vue";
import LogoBlackIcon from "~/components/SVG/LogoBlackIcon_.vue";

const { style } = defineProps<{ style?: CSSProperties }>();
const isDark = useDark();
const Logo = ref<Component>(LogoColorIcon);

watch(isDark, (value: boolean) => {
  Logo.value = value ? LogoColorIcon : LogoBlackIcon;
});
</script>

<template>
  <component :is="Logo" :width="style?.width" :height="style?.height" :style="style" />
</template>