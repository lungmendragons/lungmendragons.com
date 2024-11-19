<script setup lang="ts">
import { NA } from "naive-ui";

defineProps<{
  to: string;
  label?: string;
  external?: boolean;
  target?: string;
}>();
</script>

<template>
  <NuxtLink :custom="true" :external="external">
    <NA
      id="na"
      rel="noopener noreferrer"
      :label="label"
      :to="to"
      :target="target ?? '_blank'">
      <slot />
      <ExternalLinkIcon v-if="external" small />
    </NA>
  </NuxtLink>
</template>

<style scoped>
#na:hover { text-decoration: underline }
</style>
