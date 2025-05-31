<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

const route = useRoute();
const bingo = useBingo();

onMounted(async () => {
  document.body.style.all = "unset";
  if (route.query.game) {
    const roomId = route.query.game as string;
    await bingo.joinRoom("bingo stream source", roomId);
  }
});
</script>

<template>
  <BingoGrid />
</template>
