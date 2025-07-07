<script setup lang="ts">
import { NFlex, NIcon } from "naive-ui";
import type { DropdownOption } from "naive-ui";
import type { VNodeChild } from "vue";
import IonClose from "~icons/ion/close";
import type { TeamId, TileId } from "bingo-logic";

const { teamColorMap } = defineProps<{
  teamColorMap: DropdownOption[];
}>();

const bingo = useBingo();
const board = computed(bingo.board);
const localUserTeams = computed(() => bingo.localUserTeams());

function gridArea(i: number, w: number, h: number) {
  return `${Math.floor(i / w) + 1} / ${(i % h) + 1} / ${Math.floor(i / w) + 2} / ${(i % h) + 2}`;
}

function filterTeamOptions(tile: TileId): DropdownOption[] {
  const active = board.value?.activeBoard.tiles[tile];
  const def = board.value?.boardDef.tiles[tile];
  if (!active || !def)
    return [];
  return teamColorMap.filter((team) => {
    if (active.claimed.length === 0)
      return team.key !== 255;
    if (def.stealable)
      return !active.claimed.includes(team.key as number);
    return team.key === 255;
  });
}

function renderDropdownLabel(option: DropdownOption): VNodeChild {
  const slot = option.label === "_"
    ? [ h(NIcon, null, () => h(IonClose)), option.label ]
    : [
        h("div", { style: { backgroundColor: option.hex, borderRadius: "50%", width: "12px", height: "12px" } }),
        h("div", { style: { fontSize: "12px" } }, (option.label as string).slice(-1)),
      ];
  return h(NFlex, { align: "center" }, slot);
}

async function claim(team: TeamId, tile: TileId) {
  if (team === 255) {
    await bingo.clearTile(tile);
  } else {
    await bingo.clickTile(team, tile);
  }
}
</script>

<template>
  <NFlex
    v-if="board"
    vertical
    justify="start"
    align="start"
    class="board-container">
    <h2 class="board-heading heading-bonus">
      Bonus
    </h2>
    <div class="board-bonus">
      <template v-for="(_, i) in board.boardDef.extra" :key="i">
        <BingoTile
          v-if="localUserTeams?.length === 0"
          :key="`tile-${board.extraTile(i)}-0`"
          :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
          :tile-id="board.extraTile(i)"
          :extra="true"
        />
        <BingoTile
          v-else-if="localUserTeams?.length === 1"
          :key="`tile-${board.extraTile(i)}-1`"
          :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
          :tile-id="board.extraTile(i)"
          :extra="true"
          @click="claim(localUserTeams[0]!, board.extraTile(i))"
        />
        <NDropdown
          v-else
          :key="`tile-${board.extraTile(i)}-many`"
          size="small"
          trigger="hover"
          placement="bottom-end"
          :animated="false"
          :overlap="true"
          :options="filterTeamOptions((board.boardDef.width * board.boardDef.height) + i)"
          :render-label="renderDropdownLabel"
          style="margin:4px"
          @select="claim($event, board.extraTile(i))">
          <BingoTile
            :style="{ gridArea: gridArea(i, board.boardDef.width, board.boardDef.height) }"
            :tile-id="board.extraTile(i)"
            :extra="true"
          />
        </NDropdown>
      </template>
    </div>
    <h2 class="board-heading heading-standard">
      Board
    </h2>
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
          @click="claim(localUserTeams[0]!, board.mainTile(i))"
        />
        <NDropdown
          v-else
          :key="`tile-${board.mainTile(i)}-many`"
          size="small"
          trigger="hover"
          placement="bottom-end"
          :animated="false"
          :overlap="true"
          :options="filterTeamOptions(i)"
          :render-label="renderDropdownLabel"
          style="margin:4px"
          @select="claim($event, board.mainTile(i))">
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
  margin: 0 1rem;
}

@media (max-width: 768px) {
  .board-container {
    margin: 0;
  }
}

.board-bonus {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}

.board-standard {
  height: 750px;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}

@media (max-width: 768px) {
  .board-standard {
    height: 325px;
    gap: 1px;
  }
}

.board-heading {
  font-size: 1.875em;
  line-height: 1.225;
  margin: 0.125em 0;
  padding: 0 0.5em;
  font-weight: 700;
}

@media (max-width: 768px) {
  .board-heading {
    font-size: 1.25em;
    margin: 0;
  }
}

.heading-bonus {
  border-image: linear-gradient(180deg, #1b43df, #eb141d) 1;
  border-left: 6px solid;
}

.heading-standard {
  border-left: 6px solid #fff;
  margin-top: 1rem;
}
</style>
