<script setup lang="ts">
import { NMarquee } from "naive-ui";

const ytEmbed = ref("");
const ytTitle = ref("...");
const ytDesc = ref("...");
const ytDate = ref("");

async function getLatestVideo() {
  const recent = await $fetch("/api/pages/home/yt", { method: "GET" }) as any;
  if (recent.items && recent.items.length > 0) {
    const v = recent.items[0];
    ytEmbed.value = `https://www.youtube.com/embed/${v.id}`;
    ytTitle.value = v.snippet.title;
    ytDesc.value = v.snippet.description;
    ytDate.value = v.snippet.publishedAt;
  }
}

onMounted(() => getLatestVideo());
</script>

<template>
  <NCard size="small" class="mx-auto w-min">
    <div class="text-lg leading-6 text-center font-black">
      {{ ytTitle }}
    </div>
    <template #header>
      <div class="text-xs text-center">
        LATEST VIDEO | {{ new Date(Date.parse(ytDate)).toLocaleDateString() }}
      </div>
    </template>
    <template #cover>
      <iframe
        credentialless
        class="mx-auto"
        width="800"
        height="450"
        :src="ytEmbed"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </template>
    <template #footer>
      <NMarquee>
        <div class="text-xs mr-12">
          {{ ytDesc }}
        </div>
      </NMarquee>
    </template>
  </NCard>
</template>

<style scoped>
@media (max-width: 990px) { iframe { width: 640px; height: 360px; } }
@media (max-width: 768px) { iframe { width: 468px; height: 263px; } }
@media (max-width: 540px) { iframe { width: 384px; height: 216px; } }
@media (max-width: 420px) { iframe { width: 300px; height: 169px; } }
</style>
