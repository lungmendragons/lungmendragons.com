<script setup lang="ts">
import {
  type WIP,
  getTitle,
  getContent,
  getModalOptions,
} from "~/utils/markdown-editor";

const props = defineProps<{
  drawerTitle: string;
  history: WIP[];
  restoreFn: (title: string, description: string, content: string) => void;
  deleteFn: (data: WIP, type: string) => void;
}>();

const modal = useModal();

function doModal(data: {
  title: string;
  description: string;
  content: string;
  time: number;
}): void {
  modal.create(getModalOptions(data, props.restoreFn));
};
</script>

<template>
  <NDrawerContent :title="drawerTitle" closable>
    <template v-if="history.length === 0">
      Your history is empty.
    </template>
    <template v-else>
      <NList>
        <template v-for="wip in history.toReversed()" :key="wip.time">
          <NListItem>
            <template #suffix>
              <NFlex vertical>
                <NButton
                  secondary
                  size="small"
                  @click="doModal(wip)">
                  Details
                </NButton>
                <NButton
                  type="error"
                  secondary
                  size="small"
                  @click="deleteFn(wip, 'history')">
                  Delete
                </NButton>
              </NFlex>
            </template>
            <NThing
              :title="getTitle(wip.title)"
              :title-extra="`${wip.content.length} characters`"
              :description="new Date(wip.time).toLocaleString()">
              <div :style="{ fontSize: '0.7rem' }">
                {{ getContent(wip.content).slice(0, 200) }}
              </div>
            </NThing>
          </NListItem>
        </template>
      </NList>
    </template>
  </NDrawerContent>
</template>
