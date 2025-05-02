<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { BingoTileColor } from "~/utils/bingo/types";
import type { BingoSession, BingoAdmin, BingoPlayer, BingoSpectator } from "~/utils/bingo/types";
import { renderColorSelectTag, renderColorSelectLabel } from "~/utils/bingo/helpers";

definePageMeta({
  auth: { only: AuthPermission.User },
});

const { user } = useAuth();
const bingo = useBingo();

const gameSession = ref<BingoSession>();
const gameId = ref();
const roomIdInput = ref();
const bingoUser = ref();
const colorValue = ref<BingoTileColor>(BingoTileColor.RED);

const scores = ref({
  [BingoTileColor.RED]: computedAsync(async () => await bingo.getScoreTemporary(BingoTileColor.RED), 0),
  [BingoTileColor.BLUE]: computedAsync(async () => await bingo.getScoreTemporary(BingoTileColor.BLUE), 0),
  [BingoTileColor.GREEN]: computedAsync(async () => await bingo.getScoreTemporary(BingoTileColor.GREEN), 0),
  [BingoTileColor.YELLOW]: computedAsync(async () => await bingo.getScoreTemporary(BingoTileColor.YELLOW), 0),
  [BingoTileColor.PURPLE]: computedAsync(async () => await bingo.getScoreTemporary(BingoTileColor.PURPLE), 0),
});

async function getGameState(id: string) {
  const bs = await bingo.getBingoSession(id);
  if (bs) {
    gameId.value = bs.id;
    gameSession.value = bs;
    return true;
  }
  return false;
}

async function init() {
  if (!user.value) return;
  const _b = await bingo.createBingoSession(user.value);
  bingo.createBingoBoard();
  const game = await getGameState(_b.id);
  if (game) bingoUser.value = gameSession.value?.admins.find((admin: BingoAdmin) => admin.id === user.value?.id);
}

async function join() {
  if (!user.value) return;
  const game = await getGameState(roomIdInput.value);
  if (game) {
    const c = Math.random() < 0.5 ? BingoTileColor.RED : BingoTileColor.BLUE;
    const p = await bingo.createBingoPlayer(user.value, c);
    if (gameSession.value && p) bingo.assignPlayerToAdmin(gameSession.value.admins[0]!, p);
    // bingoUser.value = gameSession.value?.admins.find((admin: BingoAdmin) => admin.id === user.value?.id)
  }
}

watch(colorValue, () => {
  if (user.value && gameSession.value) {
    bingo.changeColor(user.value, colorValue.value);
  }
});
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NFlex vertical class="w-[300px]">
        <div>
          Game ID: {{ gameId }} <br>
          Admins: {{ gameSession?.admins.length ? gameSession?.admins.map((admin: BingoAdmin) => admin.nickname).join(", ") : "--" }} <br>
          Players: {{ gameSession?.players.length ? gameSession?.players.map((player: BingoPlayer) => player.nickname).join(", ") : "--" }} <br>
          Spectators: {{ gameSession?.spectators.length ? gameSession?.spectators.map((spectator: BingoSpectator) => spectator.nickname).join(", ") : "--" }}
        </div>
        <NDivider />
        <NButton @click="init()">init</NButton>
        <div>
          <NButton class="w-20" @click="join()">join</NButton>
          <NDivider vertical />
          <NInput
            v-model:value="roomIdInput"
            class="max-w-40"
            placeholder="room ID"
          />
        </div>
        <NDivider />
        <NFormItem label="Color" label-placement="left">
          <NSelect
            v-model:value="colorValue"
            :options="Object.values(BingoTileColor).map((color) => ({ label: color, value: color }))"
            :render-label="renderColorSelectLabel"
            :render-tag="renderColorSelectTag"
          />
        </NFormItem>
        <NDivider />
        <div v-for="c in Object.values(BingoTileColor)" :key="c">
          {{ c }}: {{ scores[c].toFixed(1) }}
        </div>
      </NFlex>
      <BingoGrid
        v-if="user"
        :user-id="user.id"
        :game-id="gameId"
      />
    </NFlex>
  </NFlex>
</template>

<style scoped>
</style>
