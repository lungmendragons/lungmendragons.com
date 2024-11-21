<script setup lang="ts">
const props = defineProps<{
  r: number;
  c: number;
  clue: number;
  numbered: boolean;
  coloured: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'max-h-[calc(100vw/14)] md:max-h-[50px]',
      `row-[${props.r + 1}_${props.r + 2}]`,
      `col-[${props.c + 1}_${props.c + 2}]`,
    ]">
    <input
      type="text"
      maxlength="1"
      class="
        font-bold
        uppercase
        text-base md:text-[32px]
        text-center
        items-center
        size-[calc(100vw/14)] md:size-[50px]
        drop-shadow-md
        bg-white"
      :style="{
        color: 'black',
        backgroundColor: props.coloured ? 'rgb(96 165 250)' : '',
      }">
    <span
      v-if="props.numbered"
      class="
        z-10
        relative
        font-bold
        text-[11px] md:text-base
        text-black/50
        left-0.5 md:left-1
        -top-[calc(100vw/14+5px)] md:-top-[51px]">
      {{ props.clue }}
    </span>
  </div>
</template>
