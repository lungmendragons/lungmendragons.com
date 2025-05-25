<script setup lang="ts">
import type { InputInst, SelectOption } from "naive-ui";
import { rng4x4, rng5x5 } from "bingo-logic/gen";

const bingo = useBingo();
const roomIdField = ref("");
const nameField = ref("");
const model = ref([
  "#2080F0",
  "#D03050",
]);

const teams = computed(bingo.teams);
const roomId = computed(() => bingo.inRoom()?.roomId);

const message = useMessage();
const roomIdInputRef = ref<InputInst>();

async function copyRoomId() {
  roomIdInputRef.value?.blur();
  if (roomId.value) {
    await navigator.clipboard.writeText(roomId.value);
    message.success("Copied");
  }
}

const boardGenData = ref<string>();

const boardGenFns = {
  top64: () => rng4x4(JSON.parse(boardGenData.value!)),
  top32: () => rng5x5(JSON.parse(boardGenData.value!)),
  top16: () => rng5x5(JSON.parse(boardGenData.value!)),
  rest: () => JSON.parse(boardGenData.value!),
};

const boardGenValue = ref<string>();

const boardGenOptions: SelectOption[] = [
  {
    label: "Top 64",
    value: "top64",
  },
  {
    label: "Top 32",
    value: "top32",
  },
  {
    label: "Top 16",
    value: "top16",
  },
  {
    label: "Rest",
    value: "rest",
  },
];

async function createBoard() {
  await bingo.setBoard(boardGenFns[boardGenValue.value as keyof typeof boardGenFns]());
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NFlex vertical class="w-[300px]">
        <template v-if="bingo.net.state.type === 'noLobby'">
          Offline
          <NButton @click="bingo.offlineRoom()">
            create offline room
          </NButton>
          <NDivider />
          Online
          <NInput
            v-model:value="nameField"
            type="text"
            placeholder="display name"
          />
          <NButton @click="bingo.createRoom(nameField)">
            Create
          </NButton>
          <div>
            <NButton class="w-20" @click="bingo.joinRoom(nameField, roomIdField)">
              Join
            </NButton>
            <NDivider vertical />
            <NInput
              v-model:value="roomIdField"
              type="text"
              class="max-w-40"
              placeholder="room ID"
            />
          </div>
        </template>
        <template v-else>
          <NInput
            v-if="roomId !== undefined"
            ref="roomIdInputRef"
            :theme-overrides="{ caretColor: 'transparent' }"
            :value="roomId"
            type="text"
            :autosize="true"
            readonly
            @click="copyRoomId"
          />
          <div>
            Users: {{ Object.values(bingo.inRoom()?.users ?? {}).map(v => `${v.name}`).join(", ") }} <br>
          </div>
          <NButton @click="bingo.leaveGame()">
            leave
          </NButton>
        </template>
        <NDivider />
        <NForm v-if="teams" :model="model">
          <NFormItem
            v-for="(team, i) in teams"
            :key="i"
            :label="team.name"
            :path="`teams[${i}].color`"
            label-placement="left">
            <NColorPicker
              v-if="model[i]"
              v-model:value="model[i]"
              :modes="['hex']"
              :show-alpha="false"
              :swatches="[
                '#18A058',
                '#2080F0',
                '#F0A020',
                '#D03050',
              ]"
            />
          </NFormItem>
          <NFormItem>
            <NButton @click="model.forEach((v, i) => bingo.setTeamColor(i, v))">
              Confirm
            </NButton>
          </NFormItem>
        </NForm>
      </NFlex>
      <BingoGrid v-if="bingo.gameState === 'gameActive' || bingo.gameState === 'waitForStart'" />
      <template v-else-if="bingo.gameState === 'boardUnset'">
        <template v-if="bingo.netState === 'offline' || bingo.inRoom()?.isSync">
          <NSelect v-model:value="boardGenValue" :options="boardGenOptions" />
          <NInput
            v-model:value="boardGenData"
            type="textarea"
            placeholder="game board data"
          />
          <NButton @click="createBoard()">
            Create Board
          </NButton>
        </template>
        <div v-else>
          Waiting for host to set the board.
        </div>
      </template>
    </NFlex>
  </NFlex>
</template>

<style scoped></style>
