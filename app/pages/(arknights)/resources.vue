<script setup lang="ts">
import ResourceItem from "~/components/ResourceIndex/Item.vue";
import { categoryOptions, languageOptions, sortOptions } from "~/utils/resources/filters";
import { type Tool, toolIndex } from "~/utils/resources/tools";
import HeroiconsInformationCircle from "~icons/heroicons/information-circle";
import { type CSSProperties, onBeforeMount, ref } from "vue";

useSeoMeta({
  title: "Arknights Resource Index | Lungmen Dragons",
});

onBeforeMount(() => {
  sortTools("name");
});

const tools = ref<Tool[]>(toolIndex);

const filters = ref({
  search: ref(""),
  category: ref<string[]>([]),
  languages: ref<string[]>([]),
  sortKey: ref<string[]>([]), // not multiple choice but still needs to be array
  recommended: ref(false),
  dead: ref(false),
});

function sortTools(value: string): void {
  switch (value) {
    case "author":
      tools.value.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "name":
    default:
      tools.value.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
};

function searchFilter(items: Tool[]): Tool[] {
  const f = filters.value;
  const search = f.search;
  const langFilter = f.languages.length > 0;
  const catgFilter = f.category.length > 0;
  return items.filter((x) => {
    if (
      (f.recommended && !x.recommended)
      || (!f.dead && x.dead)

      // there's probably a better way to do this but it works so i don't care
      || ((search.length > 0 && !x.name.toLowerCase().includes(search.toLowerCase()))
        && (search.length > 0 && !x.description.toLowerCase().includes(search.toLowerCase()))
        && (search.length > 0 && !x.author.toLowerCase().includes(search.toLowerCase())))

      || (langFilter && !x.languages.some((y: string) => f.languages.includes(y)))
      || (catgFilter && !f.category.includes(x.category))
    ) {
      return false;
    };

    return true;
  });
};

function recommendSwitchStyle({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#27b32a";
    if (focused) {
      style.boxShadow = "0 0 0 2px #27b32a40";
    }
  }
  return style;
};

function deadSwitchStyle({
  focused,
  checked,
}: {
  focused: boolean;
  checked: boolean;
}) {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#ed001c";
    if (focused) {
      style.boxShadow = "0 0 0 2px #ed001c40";
    }
  }
  return style;
};
</script>

<template>
  <div>
    <NSpace vertical class="mb-4">
      <NFlex align="center" class="w-full">
        <NFlex justify="space-between" class="flex-col md:flex-row w-full">
          <NInput
            v-model:value="filters.search"
            placeholder="Search"
            class="md:max-w-[27%] lg:max-w-[30%]"
          />
          <NSelect
            v-model:value="filters.category"
            multiple
            :options="categoryOptions"
            placeholder="Filter by category"
            max-tag-count="responsive"
            class="md:w-[25%] md:min-w-[25%]"
          />
          <NSelect
            v-model:value="filters.languages"
            multiple
            :options="languageOptions"
            placeholder="Filter by language"
            max-tag-count="responsive"
            class="md:w-[25%] md:min-w-[25%]"
          />
          <NSelect
            v-model:value="filters.sortKey"
            :options="sortOptions"
            placeholder="Sort options"
            class="md:w-[15%] md:min-w-[15%]"
            @update:value="sortTools"
          />
        </NFlex>
      </NFlex>
      <NFlex
        justify="space-between"
        align="center"
        class="flex w-full md:w-auto">
        <NFlex :size="6" class="flex-col md:flex-row mx-auto md:mx-0">
          <NSpace align="center" class="text-xs lg:text-sm mx-auto md:mx-0 md:mr-6">
            <NSwitch v-model:value="filters.recommended" :rail-style="recommendSwitchStyle" />
            Only show recommended resources
          </NSpace>
          <NSpace align="center" class="text-xs lg:text-sm mx-auto md:mx-0">
            <NSwitch v-model:value="filters.dead" :rail-style="deadSwitchStyle" />
            Show dead resources
          </NSpace>
        </NFlex>
        <NTooltip
          placement="bottom-end"
          trigger="click"
          :width="300">
          <template #trigger>
            <NButton secondary class="mx-auto md:mx-0">
              <template #icon>
                <NIcon class="text-2xl mr-1">
                  <HeroiconsInformationCircle />
                </NIcon>
              </template>
              <span class="text-xs lg:text-sm">
                What's included here?
              </span>
            </NButton>
          </template>
          <div>
            This index consists of every Arknights resource we know of. This includes, but is not limited to,
            <span class="font-bold text-green-500">
              online calculators, informative spreadsheets, planners, asset folders, and wikis,
            </span>
            plus a miscellany of others. This also includes abandoned resources, which are filtered out by
            default, but you can toggle them into view. We have not included
            <span class="font-bold text-red-500">
              anything that would violate Arknights' terms of service,
            </span>
            such as automation software, nor have we included
            <span class="font-bold text-red-500">
              links which no longer work
            </span>
            or return 404 errors.
          </div>
        </NTooltip>
      </NFlex>
    </NSpace>
    <NList hoverable bordered>
      <NListItem v-for="item in searchFilter(tools)" :key="item.name">
        <ResourceItem v-bind="item" />
      </NListItem>
    </NList>
  </div>
</template>
