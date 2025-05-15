<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { GameSession, type TileId } from "bingo-logic";

const { click } = defineProps<{
  click: (idx: TileId) => Promise<void>,
}>();

const bingo = useBingo();
const board = bingo.session.value!;

function gridArea(i: number, w: number, h: number) {
  return `${Math.floor(i / 5) + 1} / ${(i % 5) + 1} / ${Math.floor(i / 5) + 2} / ${(i % 5) + 2}`;
}

</script>

<template>
  <NFlex
    vertical
    class="board-container">
    <!-- {{ route.query.game ?? "default" }} -->
    <NFlex class="board-bonus" justify="space-between">
      <BingoTileStandard
        v-for="(_, i) in board.boardDef.extra"
        :key="`tile-${board.extraTile(i)}`"
        :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
        :tileId="board.extraTile(i)"
        @click="click(board.extraTile(i))"
      />
    </NFlex>
    <div class="board-standard">
      <BingoTileStandard
        v-for="(_, i) in board.boardDef.width * board.boardDef.height"
        :key="`tile-${board.mainTile(i)}`"
        :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
        :tileId="board.mainTile(i)"
        @click="click(board.mainTile(i))"
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