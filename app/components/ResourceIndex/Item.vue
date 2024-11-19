<script setup lang="ts">
import type { Tool } from "~/utils/resources/tools";
import type { Component } from "vue";
import { languageOptions } from "~/utils/resources/filters";
import HeroiconsBookOpen from "~icons/heroicons/book-open";
import HeroiconsBookmark from "~icons/heroicons/bookmark";
import HeroiconsCodeBracket from "~icons/heroicons/code-bracket";
import HeroiconsCpuChip from "~icons/heroicons/cpu-chip";
import HeroiconsFaceSmile from "~icons/heroicons/face-smile";
import HeroiconsTableCells from "~icons/heroicons/table-cells";

import HeroiconsWrenchScrewdriver from "~icons/heroicons/wrench-screwdriver";
import HeroiconsXMark from "~icons/heroicons/x-mark";

const props = defineProps<Tool>();

function getCategoryIcon(category: string): Component {
  if (props.dead)
    return HeroiconsXMark;

  switch (category) {
    case "tools":
      return HeroiconsWrenchScrewdriver;
    case "sheets":
      return HeroiconsTableCells;
    case "wiki":
      return HeroiconsBookOpen;
    case "code":
      return HeroiconsCodeBracket;
    case "fun":
      return HeroiconsFaceSmile;
    case "emu":
      return HeroiconsCpuChip;
    default:
      return HeroiconsBookmark;
  };
};
</script>

<template>
  <NSpace justify="space-between" item-class="w-full md:w-[48%] pt-1.5 pb-2">
    <NFlex>
      <NThing>
        <template #header>
          <NuxtLink
            :href="props.url"
            target="_blank"
            class="text-2xl text-blue-400 hover:underline">
            <NIcon>
              <component :is="getCategoryIcon(props.category)" class="size-7 text-[2rem] mr-4" />
            </NIcon>
            <span class="ml-4 mr-2">
              {{ props.name }}
            </span>
            <ExternalLinkIcon size="l" class-name="text-lg translate-y-2" />
          </NuxtLink>
        </template>

        <template #description>
          <div class="text-xs italic text-neutral-400">
            {{ props.author }}
          </div>
        </template>

        <template #footer>
          <NSpace size="small">
            <template v-if="props.languages.length === 0">
              <NTag :bordered="false" size="small">
                {{ props.category }}
              </NTag>
            </template>
            <template v-else>
              <NTag
                v-for="lang in props.languages"
                :key="lang"
                :bordered="false"
                size="small">
                {{ languageOptions.find((option) => option.value === lang)?.label }}
              </NTag>
            </template>
          </NSpace>
        </template>

        {{ props.description }}
      </NThing>
    </NFlex>
    <NFlex vertical>
      <NAlert v-if="props.success" type="success">
        {{ props.success }}
      </NAlert>
      <NAlert v-if="props.error" type="error">
        {{ props.error }}
      </NAlert>
      <NAlert v-if="props.warning" type="warning">
        {{ props.warning }}
      </NAlert>
      <NAlert v-if="props.info" type="info">
        {{ props.info }}
      </NAlert>
    </NFlex>
  </NSpace>
</template>
