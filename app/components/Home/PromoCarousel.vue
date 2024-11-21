<script setup lang="ts">
import Link from "~/components/Link.global.vue";
// Link is supposed to be auto-imported by nuxt automatically I don't understand why it isn't
</script>

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
        <Link to="https://www.youtube.com/@LungmenDragons/join">
          <img class="object-cover my-0 mx-auto h-full" src="/carousel/membership.png">
        </Link>
      </NCarouselItem>
      <NCarouselItem class="w-1/5">
        <Link to="https://forms.gle/oXEMezJqYFXcrs6bA">
          <img class="object-cover my-0 mx-auto h-full" src="/carousel/recruitment.png">
        </Link>
      </NCarouselItem>
      <NCarouselItem class="w-1/5">
        <Link to="https://forms.gle/SfZmwk1ogpLp1UdHA">
          <img class="object-cover my-0 mx-auto h-full" src="/carousel/video-submit.png">
        </Link>
      </NCarouselItem>
    </NCarousel>
  </NFlex>
</template>
