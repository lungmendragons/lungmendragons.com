<script setup lang="ts">
import { useNow } from "@vueuse/core";

definePageMeta({
  layout: "empty",
});
useHeadSafe({
  meta: [
    {
      name: "viewport",
      content: "width=1920, height=2160, initial-scale=1",
    },
  ],
});

const route = useRoute();
const bingo = useBingo();
const board = computed(bingo.board);

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

const timerDisplay = computed(() => {
  const timeLeft = timer.value ?? 0;
  const seconds = Math.floor((timeLeft / 1000) % 60).toString().padStart(2, "0");
  const minutes = Math.floor(timeLeft / 60000).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

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

onMounted(async () => {
  document.body.style.all = "unset";
  if (route.query.room) {
    const roomId = route.query.room as string;
    await bingo.joinRoom("bingo stream source", roomId);
  }
});
</script>

<template>
  <div>
    <div :style="{ width: '1920px', height: '1080px', position: 'absolute', left: 0, top: 0 }">
      <div :style="{
        position: 'absolute',
        top: '62px',
        left: '1037px',
        width: '853px',
        height: '853px',
        backgroundImage: 'url(/ld-events/bingo4/bingo_background.png)',
      }" />
      <div :style="{
        position: 'absolute',
        top: '952px',
        left: '979px',
        width: '376px',
        height: '121px',
        backgroundImage: 'url(/ld-events/bingo4/cc_tiles_background.png)',
      }" />
      <template v-if="board">
        <template v-for="(_, i) in 25" :key="`tile-main-${i}`">
          <BingoStreamTile
            :tile-id="i"
            :style="{
              position: 'absolute',
              top: `${131 + 144 * Math.floor(i / 5)}px`,
              left: `${1104 + 144 * (i % 5)}px`,
              width: '144px',
              height: '144px',
            }"
            :size-list="[
              [50, '18px'],
              [70, '16px'],
              [90, '15px'],
              ['14px'],
            ]"
            padding="8px"
          />
        </template>
        <template v-for="(_, i) in 3" :key="`tile-cc-${i}`">
          <BingoStreamCCTile
            :tile-id="board.extraTile(i)"
            :style="{
              position: 'absolute',
              top: `952px`,
              left: `${979 + 127 * i}px`,
            }"
          />
        </template>
        <div
          class="score"
          :style="{
            position: 'absolute',
            top: '140px',
            left: '920px',
            width: '98px',
            height: '76px',
            color: '#7889d6',
          }">
          {{ teamScoreList[0]?.score }}
        </div>
        <div
          class="score"
          :style="{
            position: 'absolute',
            top: '654px',
            left: '920px',
            width: '98px',
            height: '76px',
            color: '#cd6f6f',
          }">
          {{ teamScoreList[1]?.score }}
        </div>
      </template>
      <div :style="{
        position: 'absolute',
        top: '125px',
        left: '1100px',
        width: '729px',
        height: '731px',
        backgroundImage: 'url(/ld-events/bingo4/bingo_border.png)',
      }" />
      <div :style="{
        position: 'absolute',
        top: '950px',
        left: '977px',
        width: '380px',
        height: '125px',
        backgroundImage: 'url(/ld-events/bingo4/cc_tile_border.png)',
      }" />
      <div :style="{
        position: 'absolute',
        top: '8px',
        left: '1141px',
        width: '648px',
        height: '128px',
        backgroundImage: 'url(/ld-events/bingo4/board_top.png)',
      }" />
      <div
        class="timer"
        :style="{
          position: 'absolute',
          top: '35px',
          left: '1275px',
        }">
        {{ timerDisplay }}
      </div>
    </div>
    <div :style="{ width: '1920px', height: '1080px', position: 'absolute', left: 0, top: '1080px' }">
      <div :style="{
        position: 'absolute',
        top: '6px',
        left: '22px',
        width: '946px',
        height: '946px',
        backgroundImage: 'url(/ld-events/bingo4/bingo_background_large.png)',
      }" />
      <div :style="{
        position: 'absolute',
        top: '952px',
        left: '582px',
        width: '376px',
        height: '121px',
        backgroundImage: 'url(/ld-events/bingo4/cc_tiles_background.png)',
      }" />
      <template v-if="board">
        <template v-for="(_, i) in 25" :key="`tile-main-${i}`">
          <BingoStreamTile
            :tile-id="i"
            :style="{
              position: 'absolute',
              top: `${83 + 160 * Math.floor(i / 5)}px`,
              left: `${96 + 160 * (i % 5)}px`,
              width: '160px',
              height: '160px',
            }"
            :size-list="[
              [50, '19px'],
              [70, '17px'],
              [90, '16px'],
              ['15px'],
            ]"
            padding="14px"
          />
        </template>
        <template v-for="(_, i) in 3" :key="`tile-cc-${i}`">
          <BingoStreamCCTile
            :tile-id="board.extraTile(i)"
            :style="{
              position: 'absolute',
              top: `952px`,
              left: `${582 + 127 * i}px`,
            }"
          />
        </template>
      </template>
      <div :style="{
        position: 'absolute',
        top: '78px',
        left: '92px',
        width: '809px',
        height: '810px',
        backgroundImage: 'url(/ld-events/bingo4/bingo_border_large.png)',
      }" />
      <div :style="{
        position: 'absolute',
        top: '950px',
        left: '580px',
        width: '380px',
        height: '125px',
        backgroundImage: 'url(/ld-events/bingo4/cc_tile_border.png)',
      }" />
    </div>
  </div>
</template>

<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');

html {
  scrollbar-width: none;
} /* Firefox */
body::-webkit-scrollbar, body::-webkit-scrollbar-button { display: none; } /* Chrome */

.blend-img {
  background-image: var(--src);
}
.blend-img::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color);
  mask-image: var(--src);
  mask-mode: alpha;
  mix-blend-mode: var(--blend, color);
}

.timer {
  font-size: 55px;
  line-height: 70px;
  color: #fff;
  font-family: "EB Garamond", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

.score {
  font-size: 72px;
  font-family: "EB Garamond", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  text-align: center;
  line-height: 76px;
}
</style>
