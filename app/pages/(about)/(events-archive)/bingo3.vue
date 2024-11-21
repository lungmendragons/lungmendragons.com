<script setup lang="ts">
import Link from "~/components/Link.global.vue";
// Link is supposed to be auto-imported by nuxt automatically I don't understand why it isn't

useSeoMeta({
  title: "Bingo Lockout 3 | Lungmen Dragons",
});
</script>

<template>
  <NFlex vertical class="text-center">
    <div>
      Here you can find the qualifying leaderboard page for Bingo Lockout 3,
      just as as it was on the final day of the tournament.
    </div>
    <div>
      You can find the full tournament bracket on
      <Link
        external
        to="https://challonge.com/arknightsis4bingo"
        label="Challonge tournament bracket">
        Challonge.
      </Link>
      If you're interested, you can also see the boards used during the tournament via the
      <Link
        external
        to="https://docs.google.com/spreadsheets/d/1ax9orQNIQR60RZCv0-O_xmgd0vY2YPy9EixQdYi92U8/edit#gid=2098836840"
        label="Bingo board Google Sheet">
        Google Sheet.
      </Link>
    </div>
    <div class="mb-4">
      The full playlist of stream VODs, highlight videos and funny moments can be found
      <Link
        external
        to="https://www.youtube.com/playlist?list=PLLTLZagR1VUuJE-fS6Y0drxH0F0CzMDOF"
        label="IS4 Bingo Lockout Playlist">
        on YouTube.
      </Link>
    </div>
    <BingoContainer />
  </NFlex>
</template>
