<script setup lang="ts">
import type { TeamId, TileId } from "bingo-logic";

const bingo = useBingo();

const roomIdField = ref("");
const nameField = ref("");
const activeTeam = ref<TeamId>();

async function clickTile(tile: TileId) {
  // set teams for testing.
  if (bingo.isSync.value) {
    activeTeam.value = 0;
  } else {
    activeTeam.value = 1;
  }
  
  if (activeTeam.value !== undefined) {
    bingo.actions.clickTile(tile, activeTeam.value);
  }
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NFlex vertical class="w-[300px]">
        <div>
          Game ID: {{ bingo.roomId ?? "none" }} <br>
          Users: {{Object.values(bingo.users.value ?? {}).map(v => `${v.id}/${v.name}`)}} <br>
        </div>
        <NDivider />
        <NInput type="text" v-model:value="nameField" placeholder="display name" />
        <NButton @click="bingo.createRoom(nameField)">init</NButton>
        <div>
          <NButton class="w-20" @click="bingo.joinRoom(roomIdField, nameField)">join</NButton>
          <NDivider vertical />
          <NInput type="text" v-model:value="roomIdField" class="max-w-40" placeholder="room ID" />
        </div>
        <NDivider />
        <NDivider />
      </NFlex>
      <BingoGrid v-if="bingo.session.value" :click="clickTile" />
    </NFlex>
  </NFlex>
</template>

<style scoped></style>
