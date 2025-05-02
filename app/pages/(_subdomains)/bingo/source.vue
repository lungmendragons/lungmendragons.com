<script setup lang="ts">
const route = useRoute();
const game = ref("");
// console.log(route.query);

onMounted(() => {
  document.body.style.all = "unset";
  if (route.query.game) game.value = route.query.game as string;
});
</script>

<template>
  <BingoGrid :game-id="game" />
</template>
