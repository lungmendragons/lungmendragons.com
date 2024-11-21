<script setup lang="ts">
import Link from "~/components/Link.global.vue";
// Link is supposed to be auto-imported by nuxt automatically I don't understand why it isn't
</script>

<template>
  <NSpace vertical size="large">
    <div>
      Arknights Guesser is a browser game created by
      <Link
        external
        label="@boardwalkhotel_ on Twitter"
        to="https://x.com/boardwalkhotel_">
        @boardwalkhotel_
      </Link>
      who has generously agreed to have it added to our site. From a zoomed-in snapshot of an operator's art, try
      to guess who it is. Also features an endless mode!
    </div>
    <em>
      Please note that it is not formatted for mobile. You will have an easier time on desktop screens.
    </em>
    <iframe
      credentialless
      src="https://stripedypaper.github.io/ak-guesser/"
      title="Arknights Guesser"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      class="w-full [height:min(768px,70vh)]">
      Loading…
    </iframe>
  </NSpace>
</template>
