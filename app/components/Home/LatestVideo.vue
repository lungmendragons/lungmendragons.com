<script setup lang="ts">
import { NMarquee } from "naive-ui";

const API_TOKEN = process.env.YOUTUBE_API_TOKEN;
const ytEmbed = ref("");
const ytTitle = ref("...");
const ytDesc = ref("...");
const ytDate = ref("");

async function getLatestVideo() {
  const res = await $fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCS4VAQlO-ON54Ilt5ZUbdmg&key=${API_TOKEN}`,
    { method: "GET" }
  ) as any;
  console.log(res);
  const uploadsList = res.items[0].contentDetails.relatedPlaylists.uploads;
  const recent = await $fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsList}&maxResults=1&key=${API_TOKEN}`,
    { method: "GET" }
  ) as any;
  if (recent.items && recent.items.length > 0) {
    const v = recent.items[0];
    ytEmbed.value = `https://www.youtube.com/embed/${v.snippet.resourceId.videoId}`;
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
