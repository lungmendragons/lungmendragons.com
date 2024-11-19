<script setup lang="ts">
const props = defineProps<{
  src: string
  imgClass: string
  label: string
  labelClass: string
}>();
</script>

<template>
  <NFlex vertical align="center">
    <img :src="props.src" :class="props.imgClass">
    <div :class="props.labelClass">
      {{ label }}
    </div>
  </NFlex>
</template>
