<script setup lang="ts">
import { NFlex } from "naive-ui";
import type { InputInst, DropdownOption, SelectOption, CountdownTimeInfo, CountdownInst } from "naive-ui";
import type { VNodeChild } from "vue";
import { rng4x4, rng5x5 } from "bingo-logic/gen";
import { hasPermission, AuthPermission } from "~~/shared/auth";
import IonBan from "~icons/ion/ban";
import EosIconsAdmin from "~icons/eos-icons/admin";
import MdiPlay from '~icons/mdi/play';
import MdiPause from '~icons/mdi/pause';
import MdiCloseThick from '~icons/mdi/close-thick';

const { user } = useAuth();
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

const localTeamColorMap = computed(() => {
  const lut = bingo.teams()?.map(x => Number(x.name.slice(-1)));
  const local = lut ? [ ...lut, 255 ] : [ 255 ];
  return local.map(
    (teamId, key) => {
      if (teamId === 255)
        return { label: "_", hex: "#FFF", key: 255 };
      const { name, color } = (bingo.teams() ?? [])[key]!;
      return { label: name, hex: color, key };
    },
  )
});

function renderDropdownLabel(option: DropdownOption): VNodeChild {
  return h(NFlex, { align: "center" }, [
    h("div", { style: { backgroundColor: option.hex, borderRadius: "50%", width: "12px", height: "12px", }}),
    h("div", { style: { fontSize: '12px' } }, (option.label as string).slice(-1)),
  ]);
}

const roomTimer = ref(0);
const roomTimerActive = ref(false);
const roomTimerSession = ref(false);
const countdown = ref<CountdownInst>();

function handleStart() {
  if (!roomTimerSession.value) {
    roomTimerSession.value = true;
    if (!roomTimerActive.value) {
      roomTimerActive.value = true;
      message.success("Timer active");
    }
  }
}

function handlePlay() {
  if (!roomTimerActive.value) {
    roomTimerActive.value = true;
    message.success("Timer active");
  }
}

function handlePause() {
  if (roomTimerActive.value) {
    roomTimerActive.value = false;
    message.warning("Timer paused");
  }
}

function handleReset(): void {
  if (roomTimerSession.value) {
    roomTimerSession.value = false;
    countdown.value?.reset();
    message.info("Timer reset");
  }
}

function renderCountdown({ hours, minutes, seconds }: CountdownTimeInfo): VNodeChild {
  return h(
    "div",
    {
      style: {
        display: "inline-block",
        padding: '4px 16px',
        transition: 'all 0.3s ease-in-out',
        color: "white",
        backgroundImage: "linear-gradient(45deg, #1b43df, #eb141d)",
        opacity: roomTimerActive.value ? "100%" : "60%",
      } 
    },
    [
      String(minutes + (hours * 60)).padStart(2, "0"),
      ":",
      String(seconds).padStart(2, "0"),
    ],
  );
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NFlex vertical class="w-[250px]">
        <template v-if="bingo.net.state.type === 'noLobby'">
          <NInput
            v-model:value="nameField"
            type="text"
            placeholder="Enter display name"
          />
          <NDivider style="margin: 4px 0 !important" />
          <NButton @click="bingo.offlineRoom()">
            Create offline room
          </NButton>
          <!-- Online -->
          <NButton @click="bingo.createRoom(nameField)">
            Create online room
          </NButton>
          <NDivider />
          <NFlex vertical>
            <NInput
              v-model:value="roomIdField"
              type="text"
              placeholder="Room ID"
            />
            <!-- <NDivider vertical /> -->
            <NButton class="w-full" @click="bingo.joinRoom(nameField, roomIdField)">
              Join online room
            </NButton>
          </NFlex>
        </template>
        <template v-else>
          <NFlex
            v-if="user && hasPermission(user.permissions, AuthPermission.User)"
            align="center"
            class="mx-auto my-4">
            <NFormItem
              v-if="!roomTimerSession"
              label="Minutes"
              label-placement="left"
              :show-feedback="false"
              size="small">
              <NInputNumber
                v-model:value="roomTimer"
                class="w-24"
                size="small"
                button-placement="both"
                :min="0"
                :input-props="{
                  style: { textAlign: 'center' }
                }"
              />
            </NFormItem>
            <NButton
              v-if="!roomTimerSession"
              :disabled="roomTimer === 0"
              size="small"
              secondary
              @click="handleStart">
              Start
            </NButton>
            <NButton
              v-if="roomTimerSession && !roomTimerActive"
              type="success"
              size="small"
              secondary
              @click="handlePlay">
              <template #icon>
                <NIcon><MdiPlay /></NIcon>
              </template>
              Resume
            </NButton>
            <NButton
              v-if="roomTimerActive"
              type="warning"
              size="small"
              secondary
              @click="handlePause">
              <template #icon>
                <NIcon><MdiPause /></NIcon>
              </template>
              Pause
            </NButton>
            <NButton
              v-if="roomTimerSession && !roomTimerActive"
              type="error"
              size="small"
              secondary
              @click="handleReset">
              <template #icon>
                <NIcon><MdiCloseThick /></NIcon>
              </template>
              Reset
            </NButton>
          </NFlex>
          <NSpin
            size="large"
            :rotate="false"
            :show="roomTimerSession && !roomTimerActive">
            <template #icon>
              <NIcon><MdiPause /></NIcon>
            </template>
            <div class="bingo-timer">
              <NCountdown
                ref="countdown"
                :render="renderCountdown"
                :duration="roomTimer * 60000"
                :active="roomTimerActive"
              />
            </div>
          </NSpin>
          <NDivider />
          <NFormItem
            v-if="roomId !== undefined"
            label="Room ID"
            label-placement="left">
            <NInput
              ref="roomIdInputRef"
              :theme-overrides="{ caretColor: 'transparent' }"
              :input-props="{
                style: { cursor: 'pointer' }
              }"
              class="w-full"
              :value="roomId"
              type="text"
              :autosize="true"
              readonly
              @click="copyRoomId"
            />
          </NFormItem>
          <NFlex v-if="bingo.inRoom()?.isSync" vertical>
            Users:
            <template v-for="(bingoUser) in Object.values(bingo.inRoom()?.users ?? {})" :key="bingoUser.id">
              <NFlex>
                <!-- change to AuthPermission.BingoModerator when live, testing was annoying -->
                <template v-if="user && hasPermission(user.permissions, AuthPermission.User)">
                  <NButton text title="Promote user to room admin">
                    <template #icon>
                      <NIcon><EosIconsAdmin /></NIcon>
                    </template>
                  </NButton>
                  <NButton text title="Kick user">
                    <template #icon>
                      <NIcon><IonBan /></NIcon>
                    </template>
                  </NButton>
                </template>
                <NDropdown
                  size="small"
                  trigger="click"
                  :options="localTeamColorMap"
                  :render-label="renderDropdownLabel"
                  style="margin:4px"
                  @select="bingo.joinTeam">
                  <NTag
                    style="width: fit-content; cursor: pointer"
                    :color="{
                      textColor: (bingo.teams() ?? [])[bingoUser.teams[0]!]?.color ?? '#fff',
                      borderColor: (bingo.teams() ?? [])[bingoUser.teams[0]!]?.color ?? '#fff',
                    }">
                    {{ bingoUser.name }}
                  </NTag>
                </NDropdown>
              </NFlex>
            </template>
          </NFlex>  
        </template>
        <NDivider />
        <NButton v-if="bingo.inRoom()?.isSync" @click="bingo.leaveGame()">
          Leave game
        </NButton>
        <NDivider v-if="bingo.inRoom()?.isSync" />
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
      <BingoGrid
        v-if="bingo.gameState === 'gameActive' || bingo.gameState === 'waitForStart'"
        :team-color-map="localTeamColorMap"
      />
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

<style scoped>
.bingo-timer {
  font-variant-numeric: tabular-nums;
  margin: 0 auto;
  width: fit-content;
  font-size: 48px;
  font-weight: 700;
}

:deep(.n-spin) {
  color: white;
}
</style>
