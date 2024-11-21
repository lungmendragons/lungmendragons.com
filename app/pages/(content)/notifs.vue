<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";

definePageMeta({
  auth: { only: "admin" },
});

useSeoMeta({
  title: "Manage Notifications | Lungmen Dragons",
});

const { client } = useAuth();
const { data: session } = await client.getSession();

const isMD = useMediaQuery(mediaQuery.minWidth.md);
const loading = ref(false);

const notification = useNotification();
const message = useMessage();

const title = ref("");
const description = ref("");
const content = ref("");
const notifType = ref("");
const timestamp = ref<[number, number]>([ Date.now(), Date.now() + 2592000000 ]); // 30 days

const notifTypeOptions = [
  { label: "default", value: "create" },
  { label: "info", value: "info" },
  { label: "success", value: "success" },
  { label: "warning", value: "warning" },
  { label: "error", value: "error" },
];

const notifFuncPtrs = {
  create: notification.create,
  info: notification.info,
  success: notification.success,
  warning: notification.warning,
  error: notification.error,
};

function testNotif() {
  // @ts-expect-error implicit any
  const notifFunc = notifFuncPtrs[notifType.value];
  notifFunc({
    title: title.value,
    description: description.value,
    content: content.value,
    meta:
      `${new Date(timestamp.value[0]).toLocaleString()}
      to ${new Date(timestamp.value[1]).toLocaleString()}`,
  });
}

async function sendNotif(event: Event) {
  event.preventDefault();

  if (!session || loading.value)
    return;

  loading.value = true;

  if (
    !title.value
    || !description.value
    || !content.value
    || !notifType.value
    || !timestamp.value
  ) {
    message.error("missing values");
    loading.value = false;
    return;
  }

  $fetch(`/api/notifs`, {
    method: "PUT",
    body: {
      body: {
        notifFunc: notifType.value,
        title: title.value,
        description: description.value,
        content: content.value,
        timeStart: timestamp.value[0],
        timeEnd: timestamp.value[1],
      },
    },
  }).then(async ({ key }) => {
    notification.create({
      title: "Notification stored.",
      content: `Key: ${key}`,
      meta: new Date(Date.now()).toLocaleString(),
    });
  }).catch((err) => {
    message.error(err.data.message);
  });

  loading.value = false;
};
</script>

<template>
  <NFlex class="w-full md:w-4/5 mx-auto">
    <NCard title="Send Notifications">
      <template #footer>
        <NFlex justify="end">
          <NButton @click="testNotif">
            Local preview
          </NButton>
          <NButton type="primary" @click="sendNotif">
            Send announcement/notification
          </NButton>
        </NFlex>
      </template>
      <NFlex vertical>
        <NInput
          v-model:value="title"
          type="text"
          placeholder="Title"
          :style="{ fontSize: isMD ? '0.9rem' : '0.7rem' }"
        />
        <NInput
          v-model:value="description"
          type="textarea"
          placeholder="Description"
          :style="{ fontSize: isMD ? '0.9rem' : '0.7rem' }"
        />
        <NInput
          v-model:value="content"
          type="textarea"
          placeholder="Content"
          :style="{ fontSize: isMD ? '0.9rem' : '0.7rem' }"
        />
        <span>
          Datetime range in which notification will appear (default is 30 days from now)
        </span>
        <NDatePicker
          v-model:value="timestamp"
          type="datetimerange"
          clearable
        />
        <span>
          Notification type
        </span>
        <n-radio-group v-model:value="notifType" name="notifTypeGroup">
          <n-radio-button
            v-for="type in notifTypeOptions"
            :key="type.value"
            :value="type.value"
            :label="type.label"
          />
        </n-radio-group>
      </NFlex>
    </NCard>
  </NFlex>
</template>
