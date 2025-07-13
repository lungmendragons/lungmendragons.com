<script setup lang="ts">
import { NFlex, NInput, NModal } from "naive-ui";
import type { InputInst /* , DropdownOption */ } from "naive-ui";
// import type { VNodeChild } from "vue";
import MdiPlay from "~icons/mdi/play";
import MdiPause from "~icons/mdi/pause";
import MdiCloseThick from "~icons/mdi/close-thick";
import { useNow, useMediaQuery } from "@vueuse/core";
import type { BoardDef } from "bingo-logic";
import * as z from "zod";

const bingo = useBingo();
const roomIdField = ref("");
const nameField = ref("");
// const model = ref([
//   "#2080F0",
//   "#D03050",
// ]);

const isMD = useMediaQuery(mediaQuery.minWidth.md);
const url = useRequestURL();
const autojoin = ref(false);
const joinParam = url.searchParams.get("room");
if (joinParam) {
  roomIdField.value = joinParam;
  history.replaceState({}, "", `${url.origin}${url.pathname}`);
  autojoin.value = true;
}

watchEffect(() => {
  console.log(bingo.gameState);
});

// const teams = computed(bingo.teams);
const roomId = computed(() => bingo.inRoom()?.roomId);
const roomIdUrl = computed(() => roomId.value ? `${url.origin}/bingo-lockout?room=${roomId.value}` : undefined);
const message = useMessage();
const roomIdInputRef = ref<InputInst>();

async function copyRoomId() {
  roomIdInputRef.value?.blur();
  if (roomIdUrl.value) {
    await navigator.clipboard.writeText(roomIdUrl.value);
    message.success("Copied");
  }
}

const boardGenData = ref<string>();

const boardSchema = z.object({
  width: z.number(),
  height: z.number(),
  extra: z.number(),
  tiles: z.array(z.object({
    text: z.string(),
    stealable: z.boolean(),
    exclusive: z.boolean(),
    points: z.number(),
  })),
}) satisfies z.Schema<BoardDef>;

async function createBoard() {
  // try {
  if (boardGenData.value === undefined)
    return;
  try {
    const board = boardSchema.parse(JSON.parse(boardGenData.value));
    await bingo.setBoard(board);
    boardGenData.value = "";
  } catch (e) {
    console.warn(e);
    message.error("Invalid board data.");
  }
}

const teamScoreList = computed(() => {
  const game = bingo.gameSession();
  if (!game)
    return [];

  const raw = game.session.getScores();
  const lines = game.session.getLineCount();

  return game.teams.map((team, teamId) => {
    const rawScore = raw[teamId] ?? { main: 0, extra: 0 };
    const lineScore = lines[teamId] ?? { h: 0, v: 0, d: 0 };
    return {
      teamId,
      team,
      score: rawScore.main
        + (rawScore.extra === 3 ? 4 : rawScore.extra)
        + 2 * (lineScore.h + lineScore.v + lineScore.d),
    };
  });
});

function isLeadingTeam(score: number) {
  const list = teamScoreList.value.toSorted((a, b) => b.score - a.score);
  const min = list[0];
  return score === min?.score;
}

// function renderDropdownLabel(option: DropdownOption): VNodeChild {
//   return h(NFlex, { align: "center" }, [
//     h("div", { style: { backgroundColor: option.hex, borderRadius: "50%", width: "12px", height: "12px" } }),
//     h("div", { style: { fontSize: "12px" } }, (option.label as string).slice(-1)),
//   ]);
// }

const timerState = computed(bingo.timer);
const now = useNow({ interval: 100 });
const timer = computed(() => {
  const st = timerState.value;
  if (st === undefined)
    return undefined;
  if (st.kind === "active") {
    return Math.max(st.target - now.value.getTime(), 0);
  } else if (st.kind === "set" || st.kind === "paused") {
    return st.time;
  } else {
    return 0;
  }
});
const timerInput = ref(0);
const timerStarted = computed(() => {
  const kind = timerState.value?.kind;
  return kind === "active" || kind === "paused";
});
const timerSet = computed(() => {
  return (timerState.value?.kind ?? "unset") !== "unset";
});

async function handleSet() {
  await bingo.setTimer(timerInput.value * 60000);
}
async function handleReset() {
  await bingo.resetTimer();
}
function timerEnded() {
  return timerStarted.value && timer.value === 0;
}
const timerDisplay = computed(() => {
  const timeLeft = timer.value ?? 0;
  const seconds = Math.floor((timeLeft / 1000) % 60).toString().padStart(2, "0");
  const minutes = Math.floor(timeLeft / 60000).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

const showCreateRoom = ref(false);
const showJoinRoom = ref(false);

const loading = useLoading(
  computed(() => bingo.state === "connecting" || bingo.state === "gettingToken"),
);

async function createRoom() {
  showCreateRoom.value = false;
  loading.start("Creating room...");
  await bingo.createRoom(nameField.value, (err) => {
    if (err.kind === "token") {
      message.error("Could not retrieve bingo token.");
    } else if (err.kind === "ws") {
      message.error("Could not connect to bingo server.");
    }
  });
}

async function joinRoom() {
  showJoinRoom.value = false;
  loading.start("Joining room...");
  await bingo.joinRoom(nameField.value, takeRef(roomIdField, ""), (err) => {
    if (err.kind === "token") {
      message.error("Could not retrieve bingo token.");
    } else if (err.kind === "ws") {
      message.error("Could not connect to bingo server.");
    }
  });
}

const gameStateDisplay = computed(bingo.gameStateDisplay);

const users = computed(() => Object.values(bingo.inRoom()?.users ?? {}));
const tempLog = ref([
  `12:00 ${users.value[0]?.name} created the room`,
  `12:00 ${users.value[0]?.name} joined Team 1`,
  "12:00 user1 joined Team 1",
  "12:00 user2 joined Team 2",
  `12:00 ${users.value[0]?.name} crushed user1's balls`,
  "12:01 admin set timer for 30 minutes",
  "12:02 admin started game",
  `12:03 ${users.value[0]?.name} crushed user2's balls`,
  "12:07 team 1 claimed tile A4",
  "12:09 team 2 claimed tile D2",
  `12:10 ${users.value[0]?.name} uncrushed everyone's balls`,
]);

function addLog() {
  tempLog.value.push("12:11 hhhhhhhhhh");
}

const logStyles = computed(() => {
  const teams = bingo.teams() ?? [];
  return {
    ...Object.fromEntries(Object.values(bingo.inRoom()?.users ?? {}).map(u => {
      const userColor = teams.length !== 0 && u.teams.length !== 0
        ? teams[u.teams[0] as number]?.color
        : "grey";
      return [
        u.name,
        {
          padding: "1px 3px",
          color: userColor,
          fontWeight: "bold",
          border: "1px solid",
          borderColor: userColor,
          borderRadius: "2px",
        },
      ];
    })),
    ...Object.fromEntries(Object.values(teams ?? {}).map(t => {
      return [ t.name, { color: t.color, fontWeight: "bold" } ];
    })),
  }
});

onMounted(() => {
  if (autojoin.value) {
    autojoin.value = false;
    if (bingo.state === "noLobby")
      showJoinRoom.value = true;
  }
});
</script>

<template>
  <NFlex vertical class="mx-auto">
    <NModal v-model:show="showCreateRoom">
      <NCard
        class="w-[328px] mx-auto"
        :bordered="false"
        role="dialog"
        size="medium"
        title="Create Room"
        aria-modal="true">
        <NFlex>
          <NInput
            v-model:value="nameField"
            autofocus
            type="text"
            placeholder="Enter display name"
            @keyup.enter="createRoom()"
          />
          <NButton
            type="primary"
            :disabled="nameField.trim() === ''"
            attr-type="submit"
            @click="createRoom()">
            Create
          </NButton>
          <NButton type="error" @click="showCreateRoom = false">
            Cancel
          </NButton>
        </NFlex>
      </NCard>
    </NModal>
    <NModal v-model:show="showJoinRoom">
      <NCard
        class="w-[328px] mx-auto"
        :bordered="false"
        role="dialog"
        size="medium"
        title="Join Room"
        aria-modal="true">
        <NFlex>
          <NInput
            v-model:value="nameField"
            autofocus
            type="text"
            placeholder="Enter display name"
            @keyup.enter="joinRoom()"
          />
          <NButton
            type="primary"
            :disabled="nameField.trim() === ''"
            attr-type="submit"
            @click="joinRoom()">
            Join
          </NButton>
          <NButton type="error" @click="showJoinRoom = false">
            Cancel
          </NButton>
        </NFlex>
      </NCard>
    </NModal>
    <NFlex
      vertical
      size="small"
      class="w-[328px] mx-auto">
      <template v-if="bingo.net.state.type === 'noLobby'">
        <NButton @click="bingo.offlineRoom()" :size="isMD ? 'medium' : 'small'">
          Create offline room
        </NButton>
        <!-- Online -->
        <NButton @click="showCreateRoom = true" :size="isMD ? 'medium' : 'small'">
          Create online room
        </NButton>
        <NDivider style="margin: 12px 0" />
        <NFlex vertical size="small">
          <NInput
            v-model:value="roomIdField"
            type="text"
            :size="isMD ? 'medium' : 'small'"
            placeholder="Room ID"
          />
          <NButton
            class="w-full"
            :size="isMD ? 'medium' : 'small'"
            @click="bingo.joinRoom(nameField, roomIdField)">
            Join online room
          </NButton>
        </NFlex>
      </template>
    </NFlex>
    <NFlex
      class="w-full"
      :wrap="false"
      :vertical="!isMD">
      <NFlex
        vertical
        size="small"
        class="flex-none w-[328px] mx-auto xl:mx-4">
        <template v-if="gameStateDisplay">
          <!-- Timer -->
          <NFlex
            v-if="bingo.roomOwner"
            align="center"
            class="mx-auto mb-2 md:my-4 h-6">
            <NFormItem
              v-if="!timerStarted && !timerSet"
              label="Minutes"
              label-placement="left"
              :show-feedback="false"
              size="small">
              <NInputNumber
                v-model:value="timerInput"
                class="w-24"
                size="small"
                button-placement="both"
                :min="0"
                :input-props="{
                  style: { textAlign: 'center' },
                }"
              />
            </NFormItem>
            <NButton
              v-if="!timerStarted && !timerSet"
              :disabled="timerInput === 0"
              size="small"
              secondary
              @click="handleSet">
              Set
            </NButton>
            <NButton
              v-if="!timerStarted && timerSet"
              type="success"
              size="small"
              secondary
              @click="bingo.toggleTimer">
              <template #icon>
                <NIcon><MdiPlay /></NIcon>
              </template>
              Start
            </NButton>
            <NButton
              v-if="timerStarted && timerState?.kind === 'paused'"
              type="success"
              size="small"
              secondary
              @click="bingo.toggleTimer">
              <template #icon>
                <NIcon><MdiPlay /></NIcon>
              </template>
              Resume
            </NButton>
            <NButton
              v-if="timerState?.kind === 'active' && !timerEnded()"
              type="warning"
              size="small"
              secondary
              @click="bingo.toggleTimer">
              <template #icon>
                <NIcon><MdiPause /></NIcon>
              </template>
              Pause
            </NButton>
            <NButton
              v-if="timerEnded() || timerState?.kind === 'paused' && timerSet"
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
          <NFlex
            :vertical="isMD"
            :size="13"
            justify="center">
            <NSpin
              size="large"
              :show="timerState?.kind === 'paused'"
              :rotate="false">
              <template #icon>
                <NIcon><MdiPause /></NIcon>
              </template>
              <div class="bingo-timer-container">
                <div class="bingo-timer" :style="{ opacity: !timerEnded() ? '100%' : '60%' }">
                  {{ timerDisplay }}
                </div>
              </div>
            </NSpin>
            <!-- Score -->
            <NFlex v-if="teamScoreList.length > 0" justify="center">
              <NDivider v-show="isMD" style="margin: 0">
                Score
              </NDivider>
              <NFlex style="width: fit-content">
                <template
                  v-for="({ teamId, team, score }) in teamScoreList"
                  :key="`name-${teamId}`">
                  <NFlex
                    vertical
                    justify="center"
                    size="small"
                    class="text-center">
                    <template v-if="isLeadingTeam(score)">
                      <div class="bingo-score-team" :style="{ color: team.color }">
                        {{ team.name }}
                      </div>
                      <div class="bingo-score" :style="{ backgroundColor: team.color, color: 'white' }">
                        {{ score }}
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="bingo-score-team"
                        :style="{ color: timerEnded() ? '#6668' : `${team.color}66` }">
                        {{ team.name }}
                      </div>
                      <div
                        class="bingo-score"
                        :style="{ backgroundColor: timerEnded() ? '#6668' : `${team.color}66`, color: '#666' }">
                        {{ score }}
                      </div>
                    </template>
                  </NFlex>
                </template>
              </NFlex>
            </NFlex>
          </NFlex>
        </template>
        <NDivider v-if="roomId !== undefined" :style="{ margin: isMD ? '24px 0' : '12px 0' }" />
        <NFormItem
          v-if="roomId !== undefined"
          size="small"
          label="Room URL"
          label-placement="left"
          :label-style="{
            fontSize: isMD ? '14px' : '10px',
            paddingRight: '4px',
          }"
          :show-feedback="false">
          <NInput
            ref="roomIdInputRef"
            :theme-overrides="{ caretColor: 'transparent' }"
            :input-props="{
              style: {
                cursor: 'pointer',
                fontSize: isMD ? '14px' : '10px',
              },
            }"
            class="w-full"
            :size="isMD ? 'small' : 'tiny'"
            :value="roomIdUrl"
            type="text"
            :autosize="true"
            readonly
            @click="copyRoomId"
          />
        </NFormItem>
        <NFlex
          v-if="bingo.inRoom()?.isSync"
          :vertical="isMD"
          :style="{ fontSize: isMD ? '14px' : '10px' }"
          :align="isMD ? 'start' : 'center'">
          <span>
            Users:
          </span>
          <template v-for="(bingoUser) in Object.values(bingo.inRoom()?.users ?? {})" :key="bingoUser.id">
            <NFlex>
              <!-- change to AuthPermission.BingoModerator when live, testing was annoying -->
              <!-- <template v-if="user && hasPermission(user.permissions, AuthPermission.User)">
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
              </template> -->
              <!-- <NDropdown
                size="small"
                trigger="click"
                :options="localTeamColorMap"
                :render-label="renderDropdownLabel"
                style="margin:4px"
                @select="bingo.joinTeam"> -->
              <NTag
                :size="isMD ? 'medium' : 'small'"
                :style="{
                  fontSize: isMD ? '14px' : '10px',
                  width: 'fit-content',
                  cursor: 'pointer',
                }"
                :color="{
                  textColor: (bingo.teams() ?? [])[bingoUser.teams[0]!]?.color ?? '#fff',
                  borderColor: (bingo.teams() ?? [])[bingoUser.teams[0]!]?.color ?? '#fff',
                }">
                {{ bingoUser.name }}
              </NTag>
              <!-- </NDropdown> -->
            </NFlex>
          </template>
        </NFlex>
        <template v-if="bingo.gameState !== undefined">
          <NDivider :style="{ margin: isMD ? '24px 0' : '12px 0' }" />
          <NButton
            :size="isMD ? 'small' : 'tiny'"
            class="w-2/3 mx-auto"
            @click="bingo.leaveGame()">
            Leave game
          </NButton>
          <!-- <NPopconfirm v-if="bingo.state === 'inRoom'" @positive-click="bingo.offlineRoom()">
            <template #trigger>
              <NButton>
                Make into offline room
              </NButton>
            </template>
            Are you sure?
          </NPopconfirm> -->
          <NButton
            v-if="bingo.state === 'offline'"
            :size="isMD ? 'small' : 'tiny'"
            class="w-2/3 mx-auto"
            @click="showCreateRoom = true">
            Make into online room
          </NButton>
          <NDivider :style="{ margin: isMD ? '24px 0' : '12px 0' }" />
          <BingoLog :items="tempLog" :highlights="logStyles" />
          <NButton @click="addLog">add log</NButton> <!-- temp -->
        </template>
      </NFlex>
      <BingoGrid v-if="bingo.gameState === 'gameActive'" />
      <template v-else-if="bingo.gameState === 'boardUnset'">
        <NFlex
          vertical
          class="flex-1 w-[328px] md:w-[250px] mx-auto">
          <template v-if="bingo.roomOwner">
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
        </NFlex>
      </template>
    </NFlex>
  </NFlex>
</template>

<style scoped>
.bingo-timer-container {
  font-variant-numeric: tabular-nums;
  margin: 0 auto;
  width: fit-content;
  font-size: 48px;
  font-weight: 700;
}

.bingo-timer {
  display: inline-block;
  padding: 4px 16px;
  transition: all 0.3s ease-in-out;
  color: white;
  text-shadow: 0px 1px 4px #0008;
  border-radius: 4px;
  background-image: linear-gradient(45deg, #1b43df, #eb141d);
  user-select: none;
}

.bingo-score-team {
  transition: all 0.3s ease-in-out;
  font-weight: 700;
  text-align: center;
}

.bingo-score {
  width: 4rem;
  transition: all 0.3s ease-in-out;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  border-radius: 4px;
  text-shadow: 0px 1px 4px #0008;
}

:deep(.n-spin) {
  color: white;
}

@media (max-width: 768px) {
  :global(#page-content-container > .n-layout-scroll-container) {
    padding-left: 0;
    padding-right: 0;
  }
  .bingo-timer-container {
    font-size: 32px;
    margin-top: 20px;
  }
  .bingo-timer {
    padding: 0px 8px;
    line-height: 1.6;
  }
  .bingo-score-team {
    font-size: 10px;
  }
  .bingo-score {
    width: 3.25rem;
    font-size: 32px;
  }
}
</style>
