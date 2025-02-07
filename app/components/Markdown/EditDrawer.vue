<script setup lang="ts">
const { slug, authorId, requested, isEndfield = false } = defineProps<{
  slug: string;
  authorId: string;
  requested: {
    title: string;
    description: string;
    content: string;
    author: any;
    time: string;
  };
  isEndfield?: boolean;
}>();

const { session } = useAuth();
const notification = useNotification();
const showEdit = ref(false);
const loadingEdit = ref(false);
const editPage = ref({
  title: requested.title,
  description: requested.description,
  content: requested.content,
});

async function handleConfirmEdit(event: Event) {
  event.preventDefault();

  if (!session || loadingEdit.value)
    return;

  loadingEdit.value = true;

  const fetchString = isEndfield
    ? `/api/pages/guides/endfield/edit/${slug}`
    : `/api/pages/guides/edit/${slug}`;

  // todo: update this once there are other namespaces than /guides/
  $fetch(fetchString, {
    method: "PUT",
    body: {
      body: {
        title: editPage.value.title,
        description: editPage.value.description,
        author: authorId,
        time: requested.time,
        content: editPage.value.content,
      },
    },
  }).then(async () => {
    notification.success({
      title: "Edited",
      content: "Your changes have been saved.",
      meta: new Date(Date.now()).toLocaleString(),
    });
    loadingEdit.value = false;
    showEdit.value = false;
  }).catch((err) => {
    notification.error({
      content: err.data.message,
    });
  });
};
</script>

<template>
  <div>
    <NButton
      type="primary"
      size="small"
      @click="showEdit = true">
      Edit this post
    </NButton>
    <NDrawer
      v-model:show="showEdit"
      to="#page-content-container"
      placement="right"
      resizable
      :default-width="360">
      <NDrawerContent title="Edit Post" closable>
        <NFlex vertical>
          <NInput v-model:value="editPage.title" placeholder="Title" />
          <NInput
            v-model:value="editPage.description"
            placeholder="Description"
            type="textarea"
          />
          <NInput
            v-model:value="editPage.content"
            placeholder="Content"
            type="textarea"
          />
          <NButton type="primary" @click="handleConfirmEdit">
            Confirm
          </NButton>
          <span>
            Please allow up to 1 hour for changes to appear as the page's API response is cached.
            Visiting the page in private/incognito mode should show the changes immediately,
            but you will not be able to edit the updated version until the cached response expires.
          </span>
        </NFlex>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
