<script setup lang="ts">
import Fa6BrandsDiscord from "~icons/fa6-brands/discord";
import { useMediaQuery } from "@vueuse/core";

const isSM = useMediaQuery(mediaQuery.minWidth.sm);
</script>

<template>
  <NFlex
    vertical
    justify="center"
    :style="{
      width: isSM ? '75%' : '100%',
      maxHeight: '12rem',
      background:
        `linear-gradient(
          90deg,
          rgba(86, 98, 246, 0) 0%,
          rgba(86, 98, 246, 0.16) 33%,
          rgba(86, 98, 246, 0.16) 67%,
          rgba(86, 98, 246, 0) 100%
        )`,
      textAlign: 'center',
      margin: '0 auto',
      padding: '1.5rem',
    }">
    <div :style="{
      fontSize: isSM ? '1.5rem' : '1.1rem',
      lineHeight: isSM ? '2rem' : '1rem',
      fontWeight: '800',
    }">
      Join our community!
    </div>
    <div :style="{
      margin: '0.5rem auto 0.625rem auto',
      fontSize: isSM ? '0.875rem' : '0.75rem',
      lineHeight: '1.25rem',
      maxWidth: '24rem',
      textWrap: 'balance',
    }">
      We have an active community of players, enthusiasts, and people just happy to help.
    </div>
    <NButton
      round
      tag="a"
      href="https://discord.gg/lungmendragons"
      target="_blank"
      rel="noopener noreferrer"
      color="#5662f6"
      class="hover:bg-[#7c84f5]"
      :style="{ color: 'white', margin: '0 auto' }">
      <template #icon>
        <NIcon>
          <Fa6BrandsDiscord />
        </NIcon>
      </template>
      Join Now
    </NButton>
  </NFlex>
</template>
