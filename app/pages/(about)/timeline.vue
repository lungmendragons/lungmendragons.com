<script setup>
import { items } from "~/utils/timeline-items";

useSeoMeta({
  title: "Timeline | Lungmen Dragons",
});
</script>

<template>
  <NFlex
    vertical
    justify="center"
    align="center"
    class="w-full lg:w-2/3 mx-auto">
    <div class="py-2 text-4xl font-bold md:text-6xl">
      Timeline
    </div>
    <NTimeline
      size="large"
      :icon-size="28"
      class="mt-2 mb-8">
      <template v-for="item in items" :key="item.title">
        <NTimelineItem :time="item.time">
          <template #header>
            <h3 v-if="typeof item.title === 'string'">
              {{ item.title }}
            </h3>
            <component :is="item.title" v-else />
          </template>
          <template #icon>
            <NIconWrapper
              :size="28"
              :border-radius="14"
              :style="{ backgroundColor: item.color }">
              <NIcon :size="18" :component="item.icon" />
            </NIconWrapper>
          </template>
          <component :is="item.content" />
        </NTimelineItem>
      </template>
    </NTimeline>
  </NFlex>
</template>
