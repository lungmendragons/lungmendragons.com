<script setup lang="ts">
const route = useRoute();
const bingo = useBingo();

onMounted(async () => {
  document.body.style.all = "unset";
  if (route.query.game) {
    const roomId = route.query.game as string;
    await bingo.joinRoom(roomId, "bingo stream source");
  }
});
</script>

<template>
  <BingoGrid v-if="bingo.session.value" :click="async (idx) => undefined" />
</template>
