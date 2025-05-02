<script setup lang="ts">
import { computedAsync } from "@vueuse/core";

const { userId, gameId } = defineProps<{
  userId?: string;
  gameId?: string;
}>();
const bingo = useBingo();

const gameSession = computedAsync(async () => {
  if (gameId) return await bingo.getBingoSession(gameId);
}, undefined);
const board = computedAsync(async () => {
  if (gameSession.value) return gameSession.value.board;
}, undefined);

watch(gameSession, async () => bingo.updateBingoSession());

function gridArea(i: number) {
  return `${Math.floor(i / 5) + 1} / ${(i % 5) + 1} / ${Math.floor(i / 5) + 2} / ${(i % 5) + 2}`;
}

function claim(i: number, t: "standard" | "bonus") {
  const admin = gameSession.value?.admins.find((admin) => admin.id === userId);
  if (!board.value || !admin) return;
  switch (t) {
    case "standard":
      return bingo.claimBingoTileStandard(i, admin.color);
    case "bonus":
      return bingo.claimBingoTileBonus(i, admin.color);
  }
}
</script>

<template>
  <NFlex
    v-if="board"
    vertical
    class="board-container">
    <!-- {{ route.query.game ?? "default" }} -->
    <NFlex class="board-bonus" justify="space-between">
      <BingoTileBonus
        v-for="(tb, i) in board.bonus"
        :key="`tile-${tb.id}`"
        :style="{ gridArea: `1 / ${i + 1} / 1 / ${i + 2}` }"
        :tile="tb"
        @click="claim(i, 'bonus')"
      />
    </NFlex>
    <div class="board-standard">
      <BingoTileStandard
        v-for="(ts, i) in board.tiles"
        :key="`tile-${ts.id}`"
        :style="{ gridArea: gridArea(i) }"
        :tile="ts"
        @click="claim(i, 'standard')"
      />
    </div>
  </NFlex>
</template>

<style scoped>
.board-container {
  width: 750px;
}

.board-bonus {
  width: 600px;
  height: 180px;
  margin: 0 auto;
}

.board-standard {
  height: 750px;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}
</style>