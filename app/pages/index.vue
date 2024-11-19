<script setup lang="ts">
import Logo3D from "~/components/Home/Logo3D.vue";
import PromoCarousel from "~/components/Home/PromoCarousel.vue";
import DiscordButton from "~/components/Home/DiscordButton.vue";
</script>

<template>
  <NFlex
    justify="space-around"
    vertical
    :size="16"
    :style="{ minHeight: '80vh', marginTop: '1rem' }">
    <ClientOnly>
      <Logo3D /> <!-- 3D stuff needs to be client-side or it just fails. -->
    </ClientOnly>
    <PromoCarousel />
    <DiscordButton />
  </NFlex>
</template>
