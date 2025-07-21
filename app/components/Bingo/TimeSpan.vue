<script setup lang="ts">
const { text, time } = defineProps<{ text: string, time: number }>();
const isPast = (time: number): boolean => (time - Number(Date.now().toString().slice(0, 10))) < 0;
</script>

<template>
  <span :class="{ completed: isPast(time) }">
    {{ text }}
    <span style="font-weight: bold">
      <NTime :time="time" format="yyyy-MM-dd HH:mm O" unix />
    </span>
    <em>&nbsp;(<NTime :time="time" unix type="relative" />)</em>
  </span>
</template>

<style scoped>
.completed {
  opacity: 75%;
  text-decoration-line: line-through;
}
</style>
