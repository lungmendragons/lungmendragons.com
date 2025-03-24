<script setup lang="ts">
import { executeGachaRequest, type GachaRequest, type GachaResponse } from "rs-app";

console.log(executeGachaRequest({
  banner_detail: {
    Standard: {
      off_six: 42,
      off_five: 61,
      off_four: 41,
      off_three: 16,
    }
  }
}));

</script>

<template>
  <NFlex
    justify="space-around"
    vertical
    :size="16"
    :style="{ minHeight: '80vh' }">
    <ClientOnly>
      <HomeLogo3D /> <!-- 3D stuff needs to be client-side or it just fails. -->
    </ClientOnly>
    <HomeLatestVideo />
    <HomePromoCarousel />
    <HomeDiscordButton />
  </NFlex>
</template>
