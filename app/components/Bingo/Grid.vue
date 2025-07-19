<script setup lang="ts">
import { NFlex, NIcon } from "naive-ui";
import type { DropdownOption } from "naive-ui";
import type { VNodeChild } from "vue";
import IonClose from "~icons/ion/close";
import type { TeamId, TileId } from "bingo-logic";

const bingo = useBingo();
const board = computed(bingo.board);
const localUserTeams = computed(() => bingo.localUserTeams());

function gridArea(i: number, w: number, h: number) {
  return `${Math.floor(i / w) + 1} / ${(i % h) + 1} / ${Math.floor(i / w) + 2} / ${(i % h) + 2}`;
}

const teamDropdownOptions = computed(() => {
  const teams = bingo.teams();
  if (!teams)
    return [];
  console.log(bingo.localUserTeams());
  const out = bingo.localUserTeams()?.map((teamId, key) => {
    const team = teams[teamId]!;
    return {
      label: team.name,
      hex: team.color,
      teamId,
      key,
    } satisfies DropdownOption;
  }) ?? [];
  console.log(out);
  return out;
});

function teamOptions(tile: TileId): DropdownOption[] {
  const active = board.value?.activeBoard.tiles[tile];
  const def = board.value?.boardDef.tiles[tile];

  if (!active || !def)
    return [];
  if (active.claimed.length === 0) {
    return teamDropdownOptions.value;
  }
  if (!def.exclusive) {
    return teamDropdownOptions.value;
  }
  if (def.stealable) {
    return [
      ...teamDropdownOptions.value.filter(v => !active.claimed.includes(v.teamId)),
      { label: "_", hex: "#FFF", key: 255 },
    ];
  }
  return [ { label: "_", hex: "#FFF", key: 255 } ];
}

function renderDropdownLabel(option: DropdownOption): VNodeChild {
  const label = option.label as string;
  const slot = option.label === "_"
    ? [ h(NIcon, null, () => h(IonClose)), label ]
    : [
        h("div", { style: { backgroundColor: option.hex, borderRadius: "50%", width: "12px", height: "12px" } }),
        h("div", { style: { height: "28px" } }, label.length < 10 ? label : `${label.slice(0, 7).trim()}...`),
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
    <template v-if="board.boardDef.extra > 0">
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
            :style="{
              gridArea: gridArea(i, board.boardDef.width, board.boardDef.height),
              cursor: 'pointer',
            }"
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
            :options="teamOptions(board.extraTile(i))"
            :render-label="renderDropdownLabel"
            style="margin:4px"
            @select="claim($event, board.extraTile(i))">
            <BingoTile
              :style="{
                gridArea: gridArea(i, board.boardDef.width, board.boardDef.height),
                cursor: 'pointer',
              }"
              :tile-id="board.extraTile(i)"
              :extra="true"
            />
          </NDropdown>
        </template>
      </div>
    </template>
    <h2 class="board-heading heading-standard">
      Board
    </h2>
    <div class="board-standard-container">
      <div class="board-cols">
        <span class="grid-col">A</span>
        <span class="grid-col">B</span>
        <span class="grid-col">C</span>
        <span class="grid-col">D</span>
        <span class="grid-col">E</span>
      </div>
      <div class="board-rows">
        <span class="grid-row">1</span>
        <span class="grid-row">2</span>
        <span class="grid-row">3</span>
        <span class="grid-row">4</span>
        <span class="grid-row">5</span>
      </div>
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
            :style="{
              gridArea: gridArea(i, board.boardDef.width, board.boardDef.height),
              cursor: 'pointer',
            }"
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
            :options="teamOptions(board.mainTile(i))"
            :render-label="renderDropdownLabel"
            style="margin: 4px;"
            @select="claim($event, board.mainTile(i))">
            <BingoTile
              :style="{
                gridArea: gridArea(i, board.boardDef.width, board.boardDef.height),
                cursor: 'pointer',
              }"
              :tile-id="board.mainTile(i)"
            />
          </NDropdown>
        </template>
      </div>
    </div>
  </NFlex>
</template>

<style scoped>
.board-container {
  margin: 0 1rem 2rem;
}

.board-bonus {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  width: min-content;
}

.board-standard-container {
  display: grid;
  gap: 4px;
  grid-template-areas:
    ". cols"
    "rows tiles";
}

.board-cols {
  grid-area: cols;
  display: grid;
  grid-template-rows: 1;
  grid-template-columns: repeat(5, .2fr);
  gap: 4px;
}

.board-rows {
  grid-area: rows;
  display: grid;
  grid-template-rows: repeat(5, .2fr);
  grid-template-columns: 1;
  gap: 4px;
}

.grid-row, .grid-col {
  height: 100%;
  background-color: #fff1;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-row {
  width: 25px;
}

.grid-col {
  height: 25px;
}

.board-standard {
  grid-area: tiles;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.board-heading {
  font-size: 1.875em;
  line-height: 1.225;
  margin: 0.125em 0;
  padding: 0 0.5em;
  font-weight: 700;
}

.heading-bonus {
  border-image: linear-gradient(180deg, #1b43df, #eb141d) 1;
  border-left: 6px solid;
}

.heading-standard {
  border-left: 6px solid #fff;
  margin-top: 1rem;
}

@media (max-width: 1920px) {
  .board-standard-container, .board-standard {
    gap: 3px;
  }
  .grid-row {
    height: 120px;
  }
  .grid-col {
    width: 120px;
  }
}

@media (max-width: 1280px) {
  .board-container {
    margin: 0 auto;
  }
  .grid-row {
    height: 96px;
  }
  .grid-col {
    width: 96px;
  }
}

@media (max-width: 576px) {
  .grid-row, .grid-col {
    font-size: 9px;
  }
  .grid-row {
    width: 15px;
    height: 80px;
  }
  .grid-col {
    height: 15px;
    width: 80px;
  }
}

@media (max-width: 432px) {
  .grid-row, .grid-col {
    font-size: 6px;
  }
  .grid-row {
    width: 8px;
    height: 64px;
  }
  .grid-col {
    height: 8px;
    width: 64px;
  }
}
</style>
