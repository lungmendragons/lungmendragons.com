<script setup lang="ts">
import type { TileId } from "bingo-logic";

const { tileId: id, extra } = defineProps<{
  tileId: TileId;
  extra?: boolean;
}>();

const bingo = useBingo();
const tile = computed(() => {
  const res = bingo.board()?.getTile(id);
  if (res === undefined)
    return undefined;
  return {
    def: res[0],
    active: res[1],
  };
});

const claimed = computed(() => {
  const claim = tile.value?.active.claimed;
  if (!claim || claim.length === 0)
    return [];
  const teams = bingo.teams()!;
  return claim.map(v => ({ team: teams[v]!, teamId: v }));
});
</script>

<template>
  <NFlex
    vertical
    justify="center"
    align="center"
    :class="[
      'bingo-tile',
      extra ? 'bingo-tile-extra' : 'bingo-tile-standard',
    ]"
    :style="{
      position: 'relative',
      backgroundColor: '#1a1a1a',
      overflow: 'hidden',
    }">
    <div
      class="bingo-task"
      :style="{
        textShadow: claimed.length > 0 ? `#000 0 0 4px` : undefined,
      }">
      {{ tile?.def.text ?? "" }}
    </div>
    <div
      v-if="claimed.length === 1"
      :style="{
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: claimed[0]!.team.color,
      }" />
    <div
      v-for="({ team, teamId }, index) in claimed"
      v-else-if="claimed.length > 1"
      :key="`${teamId}`"
      :style="{
        width: '100%',
        height: '100%',
        position: 'absolute',
        transform: `skew(-45deg) translateX(${100 - (200 / claimed.length) * index}%)`,
        borderRight: claimed?.length !== 1 ? `1px solid #1a1a1a` : undefined,
        borderLeft: claimed?.length !== 1 ? `1px solid #1a1a1a` : undefined,
        transformOrigin: 'top',
        backgroundColor: team.color,
      }" />
  </NFlex>
</template>

<style scoped>
.bingo-tile {
  width: 144px;
  height: 144px;
  font-weight: 500;
  line-height: 1.5;
  margin: auto;
  transition: background-color 0.3s;
  color: #ffffff;
}

.bingo-tile-standard {
  border: 1px solid #ccc;
}

.bingo-tile-extra {
  border: solid;
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(45deg, #1b43df, #eb141d);
}

.bingo-task {
  padding: 8px;
  text-align: center;
  z-index: 20;
}

@media (max-width: 1920px) {
  .bingo-tile {
    width: 120px;
    height: 120px;
    font-size: 12px;
    line-height: 1.4;
  }
  .bingo-task {
    padding: 6px;
  }
}

@media (max-width: 1280px) {
  .bingo-tile {
    width: 96px;
    height: 96px;
    font-size: 10px;
    line-height: 1.3;
  }
}

@media (max-width: 576px) {
  .bingo-tile {
    width: 80px;
    height: 80px;
    font-size: 9px;
    line-height: 1.2;
  }
}

@media (max-width: 432px) {
  .bingo-tile {
    width: 64px;
    height: 64px;
    font-size: 7px;
  }
}
</style>
