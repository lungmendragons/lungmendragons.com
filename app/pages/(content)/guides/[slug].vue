<script setup lang="ts">
// todo: cache recently viewed pages (won't be a problem immediately but needs doing)
// KV read units can quickly add up, see https://developers.cloudflare.com/workers/platform/pricing/#key-value-storage-backend

import HeroiconsUserCircle from "~icons/heroicons/user-circle";
import HeroiconsCalendarDays from "~icons/heroicons/calendar-days";
import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import Fa6BrandsBilibili from "~icons/fa6-brands/bilibili";
import Fa6BrandsDiscord from "~icons/fa6-brands/discord";
import Fa6BrandsBluesky from "~icons/fa6-brands/bluesky";
import Fa6BrandsXTwitter from "~icons/fa6-brands/x-twitter";

const slug = useRoute().params.slug || "index";
const authorImage = ref("");
const requested = ref({
  title: "Loading...",
  description: "",
  author: "",
  time: "",
  content: "Loading...",
});

function getDateString(time: string): string {
  return new Date(time).toLocaleString(
    undefined,
    { weekday: "short", day: "numeric", month: "short", year: "numeric" },
  );
};

useSeoMeta({
  title: () => `${requested.value.title} | Lungmen Dragons`,
});

onMounted(() => {
  // todo: improve this fetch, ugly as hell, feels inefficient
  $fetch(`/api/pages/guides/${slug}`)
    .then((page) => {
      console.log(page);
      requested.value = page;
      $fetch(`/api/users/${page.author}`)
        .then((user) => {
          requested.value.author = user?.name as unknown as string;
          authorImage.value = user?.image as unknown as string;
        });
    });
});
</script>

<template>
  <NFlex class="w-full md:w-4/5 max-w-[800px] mx-auto">
    <NCard>
      <NH1 id="title">
        {{ requested.title }}
      </NH1>
      <NP class="text-[0.7rem] leading-[1rem] md:text-sm my-3">
        <em>{{ requested.description }}</em>
      </NP>
      <NFlex align="center">
        <NAvatar
          v-if="authorImage"
          round
          :src="authorImage"
          :size="24"
        />
        <NIcon v-else :size="24">
          <HeroiconsUserCircle />
        </NIcon>
        <div class="text-xs md:text-sm">
          {{ requested.author }}
        </div>
        <NDivider vertical />
        <NIcon :size="24">
          <HeroiconsCalendarDays />
        </NIcon>
        <div class="text-xs md:text-sm">
          {{ getDateString(requested.time) }}
        </div>
      </NFlex>
    </NCard>
    <NCard>
      <template #empty>
        <p>No content found.</p>
      </template>
      <MarkdownRenderer v-if="requested.content" :content="requested.content" />
    </NCard>
    <NCard v-if="requested.author">
      <NFlex vertical :size="12">
        <NFlex>
          <NAvatar
            v-if="authorImage"
            round
            :src="authorImage"
            :size="48"
          />
          <NFlex vertical :size="10">
            <span class="text-xl leading-5 md:text-2xl md:leading-6 font-bold">
              {{ requested.author }}
            </span>
            <NFlex>
              <NIcon>
                <Fa6BrandsYoutube />
              </NIcon>
              <NIcon>
                <Fa6BrandsBilibili />
              </NIcon>
              <NIcon>
                <Fa6BrandsDiscord />
              </NIcon>
              <NIcon>
                <Fa6BrandsBluesky />
              </NIcon>
              <NIcon>
                <Fa6BrandsXTwitter />
              </NIcon>
            </NFlex>
          </NFlex>
        </NFlex>
        <span class="text-[0.7rem] leading-[0.7rem]">
          <em>This author hasn't set a flair.</em>
        </span>
      </NFlex>
    </NCard>
  </NFlex>
</template>

<style scoped>
#title {
  margin-bottom: 8px;
  font-size: 2.5em;
  line-height: 1.5;
  font-weight: 900;
  border-image: linear-gradient(to right, #1b43df 20%, #eb141d 80%) 1;
  border-bottom: 2px solid;
}

@media (max-width: 768px) {
  #title {
    font-size: 2em;
  }
}
</style>
