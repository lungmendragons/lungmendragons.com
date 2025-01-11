<script setup lang="ts">
import {
  type WIP,
  getTitle,
  getContent,
} from "~/utils/markdown-editor";

const props = defineProps<{
  drawerTitle: string;
  drafts: WIP[];
  saveFn: () => void;
  overwriteFn: (arg: number) => void;
  loadFn: (arg: number) => void;
  deleteFn: (data: WIP, type: string) => void;
}>();
</script>

<template>
  <NDrawerContent closable>
    <template #header>
      <NFlex align="center">
        {{ props.drawerTitle }}
        <NButton
          type="primary"
          secondary
          @click="props.saveFn()">
          Save as new draft
        </NButton>
      </NFlex>
    </template>
    <template v-if="props.drafts.length === 0">
      You have no saved drafts.
    </template>
    <template v-else>
      <NList>
        <template v-for="wip in props.drafts.toReversed()" :key="wip.time">
          <NListItem>
            <template #suffix>
              <NFlex vertical>
                <NButton
                  type="primary"
                  secondary
                  size="small"
                  @click="props.loadFn(wip.time)">
                  Load
                </NButton>
                <NButton
                  type="primary"
                  secondary
                  size="small"
                  @click="props.overwriteFn(wip.time)">
                  Overwrite
                </NButton>
                <NButton
                  type="error"
                  secondary
                  size="small"
                  @click="props.deleteFn(wip, 'drafts')">
                  Delete
                </NButton>
              </NFlex>
            </template>
            <NThing
              :title="getTitle(wip.title)"
              :title-extra="`${wip.content.length} characters`"
              :description="new Date(wip.time).toLocaleString()">
              <div :style="{ fontSize: '0.7rem' }">
                {{ getContent(wip.content).slice(0, 400) }}
              </div>
            </NThing>
          </NListItem>
        </template>
      </NList>
    </template>
  </NDrawerContent>
</template>
