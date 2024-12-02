<script setup lang="ts">
import { refDebounced, useDebounceFn, useMediaQuery } from "@vueuse/core";
import OcticonInfo16 from "~icons/octicon/info-16";
import OcticonHistory16 from "~icons/octicon/history-16";
import { useMarkdownStore } from "~/stores/markdown";
import {
  type WIP,
  getTitle,
  getFilenameTitle,
  getFilenameDate,
} from "~/utils/markdown-editor";

definePageMeta({
  auth: { only: "writer" },
});

useSeoMeta({
  title: "Draft Editor | Lungmen Dragons",
});

const isMD = useMediaQuery(mediaQuery.minWidth.md);

const dialog = useDialog();
const message = useMessage();
const markdownStore = useMarkdownStore();

const history = ref<WIP[]>([]);
const savedDrafts = ref<WIP[]>([]);
const showHistory = ref(false);
const showSavedDrafts = ref(false);

const title = ref<string>("");
const description = ref<string>("");
const content = ref<string>("");
const debouncedTitle = refDebounced(title, 1000);
const debouncedContent = refDebounced(content, 1000);

const dropdownOptions = [
  { label: "Force autosave", key: "forcesave" },
  { label: "Restore version from history", key: "restore" },
  { label: "Clear history", key: "clear" },
];

function doRestore(
  restoreTitle: string,
  restoreDescription: string,
  restoreContent: string,
) {
  title.value = restoreTitle;
  description.value = restoreDescription;
  content.value = restoreContent;
};

function handleConfirmDelete(data: WIP, type: string): void {
  let deleteFn: (time: number) => string;

  if (type === "drafts") {
    deleteFn = markdownStore.deleteDraft;
  } else if (type === "history") {
    deleteFn = markdownStore.deleteWipFromHistory;
  } else {
    message.error(`Invalid delete request of type: ${type}`);
  };

  dialog.info({
    title: "Confirm delete",
    content: `Are you sure you want to delete this item from your ${type}?`,
    positiveText: "Confirm",
    negativeText: "Cancel",
    onPositiveClick: () => {
      const maybeSuccess = deleteFn(data.time);
      maybeSuccess === "success"
        ? message.success(`"${getTitle(data.title)}" deleted.`)
        : message.error(`Could not delete "${getTitle(data.title)}" (not found)`);
    },
    onNegativeClick: () => message.info("Delete cancelled."),
  });
}

function addRecent(): void {
  const msg = markdownStore.setWipRecent({
    title: title.value,
    description: description.value,
    content: content.value,
    time: Date.now(),
  });
  history.value = markdownStore.getWipHistory();
  if (msg === "success")
    message.success("Draft autosaved.");
};

const forceAddRecent = useDebounceFn(() => {
  markdownStore.forceSetWipRecent({
    title: title.value,
    description: description.value,
    content: content.value,
    time: Date.now(),
  });
  history.value = markdownStore.getWipHistory();
  message.success("Draft autosaved.");
}, 1000);

const saveDraft = useDebounceFn(() => {
  const msg = markdownStore.saveDraft({
    title: title.value,
    description: description.value,
    content: content.value,
    time: Date.now(),
  });
  savedDrafts.value = markdownStore.getSavedDrafts();
  msg === "success"
    ? message.success("Draft saved.")
    : message.error("You can save a maximum of 20 drafts.");
}, 1000);

const saveDraftOverwrite = useDebounceFn((timeToOverwrite: number) => {
  const msg = markdownStore.saveDraftOverwrite({
    title: title.value,
    description: description.value,
    content: content.value,
    time: Date.now(),
  }, timeToOverwrite);
  savedDrafts.value = markdownStore.getSavedDrafts();
  msg === "success"
    ? message.success("Draft saved.")
    : message.error("You can save a maximum of 20 drafts.");
}, 1000);

function handleDropdownSelect(key: string) {
  if (key === "forcesave") {
    forceAddRecent();
  } else if (key === "restore") {
    showHistory.value = true;
  } else if (key === "clear") {
    dialog.warning({
      title: "Confirm clear history",
      content: "Are you sure you want to clear your history?",
      positiveText: "Confirm",
      negativeText: "Cancel",
      onPositiveClick: () => {
        markdownStore.clearWipHistory();
        history.value = [];
        message.success("Cleared history.");
      },
      onNegativeClick: () => message.info("Cancelled."),
    });
  };
};

watch(debouncedTitle, () => addRecent());
watch(debouncedContent, () => addRecent());

onMounted(() => {
  title.value = markdownStore.getWipRecent().title;
  description.value = markdownStore.getWipRecent().description;
  content.value = markdownStore.getWipRecent().content;
  history.value = markdownStore.getWipHistory();
  savedDrafts.value = markdownStore.getSavedDrafts();
});
</script>

<template>
  <NFlex class="w-full md:w-4/5 mx-auto">
    <NCard title="Edit Content">
      <template #header-extra>
        <NFlex>
          <NPopover trigger="click" placement="bottom-end">
            <template #trigger>
              <NButton
                secondary
                circle>
                <template #icon>
                  <NIcon size="medium">
                    <OcticonInfo16 />
                  </NIcon>
                </template>
              </NButton>
            </template>
            <NFlex class="max-w-[240px] text-xs md:text-sm">
              <div>
                You can save up to 20 drafts. Additionally, your work will be autosaved every 5 minutes (upon changes).
              </div>
              <div>
                You can restore an autosaved version from your history if you need to, or delete individual saves, or the whole history entirely.
                Only the 10 most recent autosaves will be stored.
              </div>
              <div>
                Additionally, you can download your draft as a .md file, if you wish to work on it offline or save a backup copy.
              </div>
              <div>
                Currently, draft history is saved to your <strong>browser's local storage, <em>not</em> the website database,</strong>
                but this will change in the future.
                It will persist even if you close the browser, update your operating system, etc.
                However, if you clear your browsing history or cookies, your history will be cleared with it.
              </div>
            </NFlex>
          </NPopover>
          <NDropdown
            trigger="click"
            placement="bottom-end"
            :options="dropdownOptions"
            @select="handleDropdownSelect">
            <NButton
              type="primary"
              quaternary
              circle>
              <template #icon>
                <NIcon size="medium">
                  <OcticonHistory16 />
                </NIcon>
              </template>
            </NButton>
          </NDropdown>
        </NFlex>
      </template>
      <template #footer>
        <NFlex justify="end">
          <NButton
            :size="isMD ? 'medium' : 'small'"
            type="primary"
            @click="showSavedDrafts = true">
            Save draft
          </NButton>
          <NButton
            :size="isMD ? 'medium' : 'small'"
            type="primary"
            secondary
            tag="a"
            :href="`data:text/plain;charset=utf-8,${encodeURIComponent(debouncedContent)}`"
            :download="`LD_Draft_${getFilenameTitle(debouncedContent)}_${getFilenameDate()}.md`">
            Download to local file
          </NButton>
        </NFlex>
      </template>
      <NFlex vertical>
        <NInput
          v-model:value="title"
          type="text"
          placeholder="Title"
          maxlength="100"
          show-count
          :style="{ fontSize: isMD ? '0.9rem' : '0.7rem' }"
        />
        <NInput
          v-model:value="description"
          type="textarea"
          placeholder="Description"
          maxlength="200"
          show-count
          :style="{ fontSize: isMD ? '0.9rem' : '0.7rem' }"
        />
        <NInput
          v-model:value="content"
          type="textarea"
          placeholder="Write something..."
          class="font-mono"
          :style="{ fontSize: isMD ? '0.9rem' : '0.7rem' }"
        />
      </NFlex>
    </NCard>
    <NCard title="Rendered Preview">
      <NScrollbar class="max-h-[600px]">
        <MarkdownRenderer :content="debouncedContent" />
      </NScrollbar>
    </NCard>
    <NDrawer
      v-model:show="showHistory"
      to="#page-content-container"
      placement="right"
      :width="360">
      <MarkdownHistoryDrawer
        drawer-title="History"
        :history="history"
        :restore-fn="doRestore"
        :delete-fn="handleConfirmDelete"
      />
    </NDrawer>
    <NDrawer
      v-model:show="showSavedDrafts"
      to="#page-content-container"
      placement="right"
      :width="360">
      <MarkdownDraftDrawer
        drawer-title="Saved Drafts"
        :drafts="savedDrafts"
        :save-fn="saveDraft"
        :overwrite-fn="saveDraftOverwrite"
        :delete-fn="handleConfirmDelete"
      />
    </NDrawer>
  </NFlex>
</template>
