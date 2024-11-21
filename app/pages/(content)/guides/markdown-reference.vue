<script setup lang="ts">
// Where possible, e.g. with "meta" pages like this, we should use dedicated pages such as this one.
// Cloudflare KV storage is good for letting the writers do their thing, and good for shorter posts,
// but given the length of the content here, we can just fetch it from a file within the repo itself.

import HeroiconsUserCircle from "~icons/heroicons/user-circle";
import HeroiconsCalendarDays from "~icons/heroicons/calendar-days";

const content = ref<string>("");

function getDateString(): string {
  return new Date("2024-11-21T12:00:00").toLocaleString(
    undefined,
    { weekday: "short", day: "numeric", month: "short", year: "numeric" },
  );
};

onMounted(() => {
  fetch("/md/markdown-reference.md")
    .then((res) => {
      return res.text();
    })
    .then(md => content.value = md);
});
</script>

<template>
  <NFlex class="w-full md:w-4/5 max-w-[800px] mx-auto">
    <NCard>
      <NH1 id="title">
        Markdown Reference
      </NH1>
      <NP class="text-[0.7rem] leading-[1rem] md:text-sm my-3">
        <em>
          New and improved styling! Much better than the cringe styling from before with
          giant blue boxes for every single heading. I did not cook. But I cooked this time.
        </em>
      </NP>
      <NFlex align="center">
        <NIcon :size="24">
          <HeroiconsUserCircle />
        </NIcon>
        <div class="text-xs md:text-sm">
          toboruo
        </div>
        <NDivider vertical />
        <NIcon :size="24">
          <HeroiconsCalendarDays />
        </NIcon>
        <div class="text-xs md:text-sm">
          {{ getDateString() }}
        </div>
      </NFlex>
    </NCard>
    <NCard>
      <template #empty>
        <p>No content found.</p>
      </template>
      <MarkdownRenderer :content="content" />
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
