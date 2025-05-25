<script setup lang="ts">
import { NFlex } from "naive-ui";
import type { DropdownOption } from "naive-ui";
import type { VNodeChild } from "vue";

const bingo = useBingo();

const board = computed(bingo.board);

function gridArea(i: number, w: number, h: number) {
  return `${Math.floor(i / w) + 1} / ${(i % h) + 1} / ${Math.floor(i / w) + 2} / ${(i % h) + 2}`;
}

function renderDropdownLabel(option: DropdownOption): VNodeChild {
  return h(
    NFlex,
    { align: "center" },
    [
      h("div", {
        style: {
          backgroundColor: option.hex,
          borderRadius: "50%",
          width: "16px",
          height: "16px",
        },
      }),
      option.label as string,
    ],
  );
}

const localTeamColorMap = computed(() => bingo.localUserTeams()?.map(
  (teamId, key) => {
    const { name, color } = (bingo.teams() ?? [])[teamId]!;
    return { label: name, hex: color, key };
  },
));
const localUserTeams = computed(() => bingo.localUserTeams());
</script>

<template>
  <NFlex
    v-if="board"
    vertical
    class="board-container">
    <!-- {{ route.query.game ?? "default" }} -->
    <NFlex class="board-bonus" justify="space-between">
      <template v-for="(_, i) in board.boardDef.extra" :key="i">
        <BingoTile
          v-if="localUserTeams?.length === 0"
          :key="`tile-${board.extraTile(i)}-0`"
          :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
          :tile-id="board.extraTile(i)"
          @click="bingo.clickTile(localUserTeams[0]!, board.extraTile(i))"
        />
        <BingoTile
          v-else-if="localUserTeams?.length === 1"
          :key="`tile-${board.extraTile(i)}-1`"
          :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
          :tile-id="board.extraTile(i)"
          @click="bingo.clickTile(localUserTeams[0]!, board.extraTile(i))"
        />
        <NDropdown
          v-else
          :key="`tile-${board.extraTile(i)}-many`"
          trigger="click"
          :options="localTeamColorMap"
          :render-label="renderDropdownLabel"
          @select="bingo.clickTile($event, board.extraTile(i))">
          <BingoTile
            :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
            :tile-id="board.extraTile(i)"
          />
        </NDropdown>
      </template>
    </NFlex>
    <div class="board-standard">
      <template v-for="(_, i) in board.boardDef.width * board.boardDef.height" :key="i">
        <BingoTile
          v-if="localUserTeams?.length === 0"
          :key="`tile-${board.mainTile(i)}-0`"
          :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
          :tile-id="board.mainTile(i)"
        />
        <BingoTile
          v-else-if="localUserTeams?.length === 1"
          :key="`tile-${board.mainTile(i)}-1`"
          :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
          :tile-id="board.mainTile(i)"
          @click="bingo.clickTile(localUserTeams[0]!, board.mainTile(i))"
        />
        <NDropdown
          v-else
          :key="`tile-${board.mainTile(i)}-many`"
          trigger="click"
          :options="localTeamColorMap"
          :render-label="renderDropdownLabel"
          @select="bingo.clickTile($event, board.mainTile(i))">
          <BingoTile
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
