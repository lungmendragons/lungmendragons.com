<script setup lang="ts">
import type { TileId } from "bingo-logic";

const { tileId: id } = defineProps<{
  tileId: TileId;
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

function dynFontSize(len: number): string {
  if (len < 50)
    return "18px";
  if (len < 80)
    return "16px";
  else
    return "15px";
}
</script>

<template>
  <NFlex
    vertical
    justify="center"
    align="center"
    class="bingo-tile"
  >
    <div
      v-if="claimed"
      :style="{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: claimed.color,
        mixBlendMode: 'color',
      }"
    />
    <div
      class="bingo-task"
      :style="{
        fontSize: dynFontSize(tile?.def.text.length ?? 0),
        // padding: (tile?.def.text.length ?? 0) > 80 ? '8px' : '8px',
      }"
    >
      {{ tile?.def.text ?? "" }}
    </div>
  </NFlex>
</template>

<style scoped>
.bingo-tile {
  width: 144px;
  height: 144px;
  margin: auto;
  transition: background-color 0.3s;
}

.bingo-task {
  text-align: center;
  padding: 8px;
  color: #ffffff;
}

/* .bingo-claim, .bingo-task, .bingo-points {
  font-weight: 500;
  font-size: 20px;
} */
</style>
