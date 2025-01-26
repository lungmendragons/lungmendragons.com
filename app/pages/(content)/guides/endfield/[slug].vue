<script setup lang="ts">
// todo: cache recently viewed pages (won't be a problem immediately but needs doing)
// KV read units can quickly add up, see https://developers.cloudflare.com/workers/platform/pricing/#key-value-storage-backend

import HeroiconsUserCircle from "~icons/heroicons/user-circle";
import HeroiconsCalendarDays from "~icons/heroicons/calendar-days";

const { user } = useAuth();
const notFound = ref(false);
const slug = useRoute().params.slug as string || "index";

const authorId = ref("");
const requested = ref({
  title: "Loading...",
  description: "",
  author: {} as any,
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
  $fetch(`/api/pages/guides/endfield/${slug}`)
    .then((page) => {
      requested.value = page;
      authorId.value = page.author;
      $fetch(`/api/users/${page.author}`)
        .then((user) => {
          requested.value.author = user;
        });
    })
    .catch((error) => {
      if (error.statusCode === 404) {
        notFound.value = true;
        requested.value = {
          title: "404 Not Found",
          description: "An error occurred while fetching the requested content.",
          author: "",
          time: "",
          content: "![404 Not Found](/official/stickers/fb7c333e68c5a8a967d72deb77104735.png)",
        };
      };
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
      <NFlex v-if="!notFound" align="center">
        <NAvatar
          v-if="requested.author.image"
          round
          :src="requested.author.image"
          :size="24"
        />
        <NIcon v-else :size="24">
          <HeroiconsUserCircle />
        </NIcon>
        <div class="text-xs md:text-sm">
          {{ requested.author.name }}
        </div>
        <NDivider vertical />
        <NIcon :size="24">
          <HeroiconsCalendarDays />
        </NIcon>
        <div class="text-xs md:text-sm">
          {{ getDateString(requested.time) }}
        </div>
        <NDivider v-if="authorId === user?.id" vertical />
        <MarkdownEditDrawer
          v-if="authorId === user?.id"
          :slug="slug"
          :author-id="authorId"
          :requested="requested"
          :is-endfield="true"
        />
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
            v-if="requested.author.image"
            round
            :src="requested.author.image"
            :size="48"
          />
          <NFlex vertical :size="10">
            <span class="text-xl leading-5 md:text-2xl md:leading-6 font-bold">
              {{ requested.author.name }}
            </span>
            <UserSocials
              :youtube="requested.author.youtube ?? ''"
              :bilibili="requested.author.bilibili ?? ''"
              :discord="requested.author.discord ?? ''"
              :bluesky="requested.author.bluesky ?? ''"
              :twitter="requested.author.twitter ?? ''"
              :reddit="requested.author.reddit ?? ''"
            />
          </NFlex>
        </NFlex>
        <span class="text-[0.7rem] leading-[0.7rem]">
          <em>{{ requested.author.flair }}</em>
        </span>
      </NFlex>
    </NCard>
    <NCard v-else-if="notFound">
      <span class="text-[grey]">
        <em>You made Jessica sad.</em>
      </span>
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
