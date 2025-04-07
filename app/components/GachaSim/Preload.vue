<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { renderImgComponent, charImg } from "~/utils/gachasim";

const isMD = useMediaQuery(mediaQuery.minWidth.md);
</script>

<template>
  <div>
    <component
      v-for="c in charImg"
      :key="c.character"
      v-show="false"
      :is="renderImgComponent(c, isMD)"
    />
  </div>
</template>