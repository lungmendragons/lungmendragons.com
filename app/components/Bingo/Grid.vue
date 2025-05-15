<script setup lang="ts">
// import { GameSession, type TileId } from "bingo-logic";
import { renderDropdownLabel } from "~/utils/bingo/helpers";

const bingo = useBingo();
const board = bingo.session.value!;

function gridArea(i: number, _w: number, _h: number) {
  return `${Math.floor(i / 5) + 1} / ${(i % 5) + 1} / ${Math.floor(i / 5) + 2} / ${(i % 5) + 2}`;
}

function clickTile(tile: number, team: number) {
  bingo.actions.clickTile(tile, team);
}
</script>

<template>
  <NFlex
    vertical
    class="board-container">
    <!-- {{ route.query.game ?? "default" }} -->
    <NFlex class="board-bonus" justify="space-between">
      <template v-for="(_, i) in board.boardDef.extra" :key="i">
        <NDropdown
          trigger="click"
          :options="bingo.teamColorMap"
          :render-label="renderDropdownLabel"
          @select="clickTile(board.extraTile(i), $event)">
          <BingoTileStandard
            :key="`tile-${board.extraTile(i)}`"
            :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
            :tile-id="board.extraTile(i)"
          />
        </NDropdown>
      </template>
    </NFlex>
    <div class="board-standard">
      <template v-for="(_, i) in board.boardDef.width * board.boardDef.height" :key="i">
        <NDropdown
          trigger="click"
          :options="bingo.teamColorMap"
          :render-label="renderDropdownLabel"
          @select="clickTile(board.mainTile(i), $event)">
          <BingoTileStandard
            :key="`tile-${board.mainTile(i)}`"
            :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
            :tile-id="board.mainTile(i)"
          />
        </NDropdown>
      </template>
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