<script setup lang="ts">
import type { Component } from "vue";
import { type Tool, languageOptions } from "~/utils/resource-index";
import HeroiconsBookOpen from "~icons/heroicons/book-open";
import HeroiconsBookmark from "~icons/heroicons/bookmark";
import HeroiconsCodeBracket from "~icons/heroicons/code-bracket";
import HeroiconsCpuChip from "~icons/heroicons/cpu-chip";
import HeroiconsFaceSmile from "~icons/heroicons/face-smile";
import HeroiconsTableCells from "~icons/heroicons/table-cells";

import HeroiconsWrenchScrewdriver from "~icons/heroicons/wrench-screwdriver";
import HeroiconsXMark from "~icons/heroicons/x-mark";

const {
  id,
  data,
  editFn,
} = defineProps<{
  id: string;
  data: Tool;
  editFn: (id: string, data: Tool) => void;
}>();
const { user } = useAuth();

function getCategoryIcon(category: string): Component {
  if (data.dead)
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
            :href="data.url"
            target="_blank"
            class="text-2xl text-blue-400 hover:underline">
            <NIcon>
              <component :is="getCategoryIcon(data.category)" class="size-7 text-[2rem] mr-4" />
            </NIcon>
            <span class="ml-4 mr-2">
              {{ data.name }}
            </span>
            <ExternalLinkIcon size="l" class-name="text-lg translate-y-2" />
          </NuxtLink>
        </template>

        <template #description>
          <div class="text-xs italic text-neutral-400">
            {{ data.author }}
          </div>
        </template>

        <template #footer>
          <NSpace size="small">
            <template v-if="data.languages.length === 0">
              <NTag :bordered="false" size="small">
                {{ data.category }}
              </NTag>
            </template>
            <template v-else>
              <NTag
                v-for="lang in data.languages"
                :key="lang"
                :bordered="false"
                size="small">
                {{ languageOptions.find((option) => option.value === lang)?.label }}
              </NTag>
            </template>
          </NSpace>
        </template>

        <!-- @vue-expect-error permissions property does not exist on user type -->
        <template v-if="user?.permissions & 4" #action>
          <NButton
            type="primary"
            size="small"
            @click="editFn(id, data)">
            Member view: Edit
          </NButton>
        </template>

        {{ data.description }}
      </NThing>
    </NFlex>
    <NFlex vertical>
      <NAlert v-if="data.success" type="success">
        {{ data.success }}
      </NAlert>
      <NAlert v-if="data.error" type="error">
        {{ data.error }}
      </NAlert>
      <NAlert v-if="data.warning" type="warning">
        {{ data.warning }}
      </NAlert>
      <NAlert v-if="data.info" type="info">
        {{ data.info }}
      </NAlert>
    </NFlex>
  </NSpace>
</template>
