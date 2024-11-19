<template>
  <NFlex justify="center" :style="{ margin: '1.5rem 0' }">
    <NCarousel
      autoplay
      effect="card"
      draggable
      class="
        h-32 sm:h-44 md:h-52 lg:h-64 xl:h-80
        w-80 sm:w-[440px] md:w-[520px] lg:w-[640px] xl:w-[800px]">
      <NCarouselItem class="w-1/5">
        <img class="object-cover my-0 mx-auto h-full" src="/carousel/membership.png">
      </NCarouselItem>
      <NCarouselItem class="w-1/5">
        <img class="object-cover my-0 mx-auto h-full" src="/carousel/recruitment.png">
      </NCarouselItem>
      <NCarouselItem class="w-1/5">
        <img class="object-cover my-0 mx-auto h-full" src="/carousel/video-submit.png">
      </NCarouselItem>
    </NCarousel>
  </NFlex>
</template>
