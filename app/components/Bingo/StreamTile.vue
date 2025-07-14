<script setup lang="ts">
import type { TileId } from "bingo-logic";

const { tileId: id, sizeList, padding } = defineProps<{
  tileId: TileId;
  sizeList: Array<[number, string] | [string]>;
  padding: string;
}>();

// const regex = /^Clear .*?(F\d.*?);/i;

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

const text = computed(() => {
  const out = tile.value?.def.text ?? "";
  // return out.replace(regex, (s, c1) => `[${c1}]`);
  return out;
});

const claimed = computed(() => {
  const team = tile.value?.active.claimed[0];
  if (team === undefined)
    return undefined;
  return bingo.teams()![team];
});

function dynFontSize(len: number): string {
  for (const v of sizeList) {
    if (v.length === 1) {
      return v[0];
    } else if (len < v[0]) {
      return v[1];
    }
  }
  return "1em";

  if (len < 50)
    return "18px";
  if (len < 70)
    return "16px";
  else if (len < 90)
    return "15px";
  else
    return "14px";
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
        padding,
        // padding: (tile?.def.text.length ?? 0) > 80 ? '8px' : '8px',
      }"
    >
      {{ text }}
    </div>
  </NFlex>
</template>

<style scoped>
.bingo-tile {
  margin: auto;
  transition: background-color 0.3s;
}

.bingo-task {
  text-align: center;
  color: #ffffff;
}

/* .bingo-claim, .bingo-task, .bingo-points {
  font-weight: 500;
  font-size: 20px;
} */
</style>
