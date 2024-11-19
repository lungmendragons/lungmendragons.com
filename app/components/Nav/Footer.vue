<script setup>
import Socials from "./Socials.vue";
import { useMediaQuery } from "@vueuse/core";
</script>

<template>
  <footer :style="{ justifyContent: 'center', marginTop: '1rem' }">
    <NFlex vertical>
      <NDivider :style="{ margin: '0' }" />
      <NFlex
        justify="space-between"
        align="center"
        :style="{ paddingTop: '0.5rem', paddingBottom: '1rem' }">
        <div
          :style="{
            margin: useMediaQuery(mediaQuery.minWidth.md) ? '0' : '0 auto',
            textAlign: 'center',
            fontSize: '0.75rem',
            lineHeight: '1rem',
          }">
          &copy; 2024 Lungmen Dragons. All rights reserved.
        </div>
        <Socials
          :style="{
            margin: useMediaQuery(mediaQuery.minWidth.md) ? '0' : '0 auto',
            width: '12rem',
            padding: '0.5rem 0.25rem',
          }"
        />
      </NFlex>
    </NFlex>
  </footer>
</template>
