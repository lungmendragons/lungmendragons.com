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
