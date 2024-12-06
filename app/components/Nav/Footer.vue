<script setup>
import Socials from "./Socials.vue";
import Link from "~/components/Link.global.vue";
import { useMediaQuery } from "@vueuse/core";
import IcOutlineEmail from "~icons/ic/outline-email";

const isMD = useMediaQuery(mediaQuery.minWidth.md);
</script>

<template>
  <footer style="margin-top: 1rem">
    <NFlex vertical>
      <NDivider style="margin: 0" />
      <NFlex
        align="center"
        style="padding-top: 0.5rem; padding-bottom: 1rem"
        :justify="isMD ? 'space-between' : 'center'">
        <NFlex
          vertical
          style="font-size: 0.75rem"
          :size="2">
          <span>
            &copy; 2024 Lungmen Dragons. All rights reserved.
          </span>
          <NFlex
            align="center"
            :justify="isMD ? '' : 'center'"
            :size="4">
            <NIcon size="medium">
              <IcOutlineEmail />
            </NIcon>
            <Link to="mailto:lungmendragons@gmail.com">
              lungmendragons@gmail.com
            </Link>
          </NFlex>
        </NFlex>
        <Socials style="margin-top: 4px; width: 12rem" />
      </NFlex>
    </NFlex>
  </footer>
</template>
