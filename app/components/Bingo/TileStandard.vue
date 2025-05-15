<script setup lang="ts">
import { type TileDef, type ActiveTile, GameSession, type TileId, type TeamId } from "bingo-logic";

const { tileId: id } = defineProps<{
  tileId: TileId,
}>();

const bingo = useBingo();
const tile = computed(() => {
  const res = bingo.session.value?.getTile(id);
  if(res === undefined) return undefined;
  return {
    def: res[0],
    active: res[1],
  }
});

const claimed = computed(() => {
  const team = tile.value?.active.claimed[0];
  if(team === undefined) return undefined;
  return bingo.teams.value[team];
});

</script>

<template>
  <NFlex
    vertical
    justify="center"
    align="center"
    class="bingo-tile"
    :style="{
      backgroundColor: claimed?.color ?? '#1a1a1a',
      textShadow: '1px 1px 3px black, 0 0 3px black',
    }">
    <div class="bingo-claim">
      claim: {{ claimed?.name ?? "none" }}
    </div>
    <div class="bingo-task">
      task: {{ tile?.def.text ?? "" }}
    </div>
    <div class="bingo-points">
      pts: {{ tile?.def.points ?? "" }}
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
