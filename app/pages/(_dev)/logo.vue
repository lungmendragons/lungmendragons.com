<script setup lang="ts">
import LogoBlackFull from "~/components/Logo/BlackFull.vue";
import LogoBlackIcon from "~/components/Logo/BlackIcon.vue";
import LogoBlackText from "~/components/Logo/BlackText.vue";
import LogoColorFull from "~/components/Logo/ColorFull.vue";
import LogoColorIcon from "~/components/Logo/ColorIcon.vue";
import LogoWhiteFull from "~/components/Logo/WhiteFull.vue";
import LogoWhiteIcon from "~/components/Logo/WhiteIcon.vue";
import LogoWhiteText from "~/components/Logo/WhiteText.vue";

definePageMeta({
  auth: { only: AuthPermission.Admin },
});
</script>

<template>
  <div>
    LogoBlackFull:
    <LogoBlackFull :style="{ height: '8rem' }" />
    <br>
    LogoBlackIcon:
    <LogoBlackIcon :style="{ height: '8rem' }" />
    <br>
    LogoBlackText:
    <LogoBlackText :style="{ height: '8rem' }" />
    <br>
    LogoColorFull:
    <LogoColorFull :style="{ height: '8rem' }" />
    <br>
    LogoColorIcon:
    <LogoColorIcon :style="{ height: '8rem' }" />
    <br>
    LogoWhiteFull:
    <LogoWhiteFull :style="{ height: '8rem' }" />
    <br>
    LogoWhiteIcon:
    <LogoWhiteIcon :style="{ height: '8rem' }" />
    <br>
    LogoWhiteText:
    <LogoWhiteText :style="{ height: '8rem' }" />
    <br>
  </div>
</template>
