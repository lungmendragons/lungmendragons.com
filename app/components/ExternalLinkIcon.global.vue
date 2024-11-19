<script setup lang="ts">
import type { Component } from "vue";
import HeroiconsArrowTopRightOnSquare from "~icons/heroicons/arrow-top-right-on-square";
import HeroiconsArrowTopRightOnSquare16Solid from "~icons/heroicons/arrow-top-right-on-square-16-solid";
import HeroiconsArrowTopRightOnSquare20Solid from "~icons/heroicons/arrow-top-right-on-square-20-solid";

type Size = "small" | "medium" | "large";
type SizeProps = {
  [key in Size]?: boolean;
};

const props = defineProps<SizeProps>();

function getIcon(): Component {
  if (props.small)
    return HeroiconsArrowTopRightOnSquare16Solid;
  if (props.medium)
    return HeroiconsArrowTopRightOnSquare20Solid;
  if (props.large)
    return HeroiconsArrowTopRightOnSquare;
  return HeroiconsArrowTopRightOnSquare20Solid;
};
</script>

<template>
  <NIcon>
    <component :is="getIcon()" />
  </NIcon>
</template>
