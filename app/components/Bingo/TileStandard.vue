<script setup lang="ts">
import type { BingoTileStandard } from "~/utils/bingo/types";

const props = defineProps<{
  tile: BingoTileStandard;
}>();
</script>

<template>
  <NFlex
    vertical
    justify="center"
    align="center"
    class="bingo-tile"
    :style="{
      backgroundColor: props.tile.claim ?? '#1a1a1a',
      textShadow: '1px 1px 3px black, 0 0 3px black',
    }">
    <div class="bingo-claim">
      claim: {{ props.tile.claim }}
    </div>
    <div class="bingo-task">
      task: {{ props.tile.task }}
    </div>
    <div class="bingo-points">
      pts: {{ props.tile.points }}
    </div>
  </NFlex>
</template>

<style scoped>
.bingo-tile {
  font-weight: 700;
  width: 144px;
  height: 144px;
  margin: auto;
  border: 1px solid #ccc;
  transition: background-color 0.3s;

  /* temporary */
  cursor: pointer;
}

/* .bingo-claim, .bingo-task, .bingo-points {
  font-weight: 500;
  font-size: 20px;
} */
</style>
