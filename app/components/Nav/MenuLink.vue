<script setup lang="ts">
const {
  to,
  external = false,
  target = null,
  activeClass = "",
  style = "",
} = defineProps<{
  to?: string;
  external?: boolean;
  target?: "_blank" | "_parent" | "_self" | "_top" | (string & {}) | null;
  activeClass?: string;
  style?: string;
}>();

const loadingBar = useLoadingBar();
</script>

<template>
  <NuxtLink
    :to="to"
    :external="external"
    :target="target"
    :active-class="activeClass"
    :style="style"
    @click="loadingBar.start()">
    <slot />
  </NuxtLink>
</template>
