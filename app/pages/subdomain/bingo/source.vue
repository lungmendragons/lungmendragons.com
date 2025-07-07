<script setup lang="ts">
definePageMeta({
  layout: "empty",
});
useHeadSafe({
  meta: [
    {
      name: "viewport",
      content: "width=1920, height=1080, initial-scale=1",
    },
  ],
});

const route = useRoute();
const bingo = useBingo();
const board = computed(bingo.board);

onMounted(async () => {
  document.body.style.all = "unset";
  if (route.query.game) {
    const roomId = route.query.game as string;
    await bingo.joinRoom("bingo stream source", roomId);
  }
});
</script>

<template>
  <div :style="{ width: '1920px', height: '1080px' }">
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
          }"
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
    <div :style="{
      position: 'absolute',
      top: '35px',
      left: '1370px',
    }">
      00:00
    </div>
  </div>
</template>

<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');

html {
  scrollbar-width: none;
} /* Firefox */
body::-webkit-scrollbar, body::-webkit-scrollbar-button { display: none; } /* Chrome */

.cinzel-decorative-bold {
  font-family: "Cinzel Decorative", serif;
  font-weight: 700;
  font-style: normal;
}

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
  font-weight: 800;
  font-style: normal;
}
</style>
