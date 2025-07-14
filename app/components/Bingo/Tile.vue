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
  const team = tile.value?.active.claimed[0];
  if (team === undefined)
    return undefined;
  return bingo.teams()![team];
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
      backgroundColor: claimed?.color ?? '#1a1a1a',
      cursor: bingo.roomOwner ? 'pointer' : 'auto',
    }">
    <div class="bingo-task">
      {{ tile?.def.text ?? "" }}
    </div>
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
