<script setup lang="ts">
import Fa6BrandsDiscord from "~icons/fa6-brands/discord";
import { useMediaQuery } from "@vueuse/core";

const isSM = useMediaQuery(mediaQuery.minWidth.sm);
</script>

<template>
  <NCard style="max-width: 420px; margin: 0 auto; background-color: rgba(86,98,246,0.2);">
    <NFlex
      vertical
      justify="center"
      :style="{
        textAlign: 'center',
        margin: '0 auto',
      }">
      <div :style="{
        fontSize: isSM ? '1.2rem' : '1rem',
        lineHeight: isSM ? '1.5rem' : '0.8rem',
        fontWeight: '800',
      }">
        Join our Discord community!
      </div>
      <div :style="{
        margin: '0.375rem auto 0.5rem auto',
        fontSize: isSM ? '0.75rem' : '0.625rem',
        lineHeight: '1rem',
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
        size="small"
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
  </NCard>
</template>
