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

<style scoped>
@media (max-width: 990px) { iframe { width: 640px; height: 360px; } }
@media (max-width: 768px) { iframe { width: 468px; height: 263px; } }
@media (max-width: 540px) { iframe { width: 384px; height: 216px; } }
@media (max-width: 420px) { iframe { width: 300px; height: 169px; } }
</style>
