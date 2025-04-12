<script setup lang="ts">
import Link from "~/components/Link.global.vue";
import type { CascaderOption, FormInst, FormItemRule, FormValidationError } from "naive-ui";
import { useMarkdownStore } from "~/stores/markdown";
import type { WIP } from "~/utils/markdown-editor";

definePageMeta({
  auth: { only: "writer" },
});

useSeoMeta({
  title: "Post Content | Lungmen Dragons",
});

const { user } = useAuth();
const message = useMessage();
const notification = useNotification();
const markdownStore = useMarkdownStore();
const saved = ref<WIP[]>([]);

const title = ref<string>("");
const description = ref<string>("");
const content = ref<string>("");
const location = ref<string>();
const slug = ref<string>("");
const loading = ref(false);

const postFormRef = ref<FormInst | null>(null);

const postFormValue = ref({
  title,
  description,
  location,
  slug,
  content,
});

const postLocations: Ref<CascaderOption[]> = ref([
  {
    label: "Guides",
    value: "guides",
    children: [
      {
        label: "Arknights",
        value: "guides/index",
      },
      {
        label: "Arknights: Endfield",
        value: "guides/endfield",
      },
    ],
  },
]);

const postFormRules = {
  title: {
    required: true,
    trigger: "blur",
    message: "Must not be empty.",
  },
  description: {
    required: true,
    trigger: "blur",
    message: "Must not be empty.",
  },
  location: {
    required: true,
    trigger: "blur",
    validator: (_rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!value) {
          reject(new Error("Value is undefined"));
        } else if (value.slice(0, 6) !== "guides") {
          reject(new Error("Must be posted in /guides"));
        } else {
          resolve();
        };
      });
    },
  },
  slug: {
    required: true,
    trigger: "blur",
    validator: (_rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        const match = value.match(/([a-z0-9-])+/g);
        // Ugly but I don't care rn
        if (value.length === 0) {
          reject(new Error("Must not be empty."));
        } else if (!match || match.length > 1 || match[0] !== value) {
          reject(new Error("Contains invalid characters. Must only contain lowercase letters, numbers, or hyphens."));
        } else if (!match[0].match(/([a-z0-9])+/g)) {
          reject(new Error("Must not only consist of hyphens."));
        } else if (match[0].length < 3) {
          reject(new Error("Must be at least 3 characters."));
        } else if (match[0].slice(-1) === "-" || match[0].slice(0, 1) === "-") {
          reject(new Error("Must not start or end with a hyphen."));
        } else {
          // todo: check url doesn't already exist + make above validations more robust
          resolve();
        };
      });
    },
  },
  content: {
    required: true,
    trigger: "blur",
    message: "Must not be empty.",
  },
};

function getDropdownOptions() {
  return saved.value.map((draft: WIP) => ({
    label: draft.title,
    key: draft.time,
  }));
};

function handleDropdownSelect(key: string): void {
  const draft = saved.value.find((d: WIP) => d.time === Number(key));
  if (!draft) {
    message.error("Draft not found.");
  } else {
    title.value = draft.title;
    description.value = draft.description;
    content.value = draft.content;
  }
}

function getSlugLabel(): string {
  if (!location.value)
    return "/";
  const items = location.value?.split("/");
  if (items?.slice(-1)[0] === "index") {
    return `${items?.slice(0, -1).join("/")}/`;
  } else {
    return `${items?.join("/")}/`;
  };
};

async function handlePost(event: Event) {
  event.preventDefault();

  if (!user.value || loading.value)
    return;

  loading.value = true;

  // Form validation is currently bugged, try-catch block is a workaround.
  // The validate() function callback will execute, but it will then throw an uncaught error,
  // and _valid will be undefined. The validation itself works, it's just the error handling.
  try {
    const _valid = await postFormRef.value?.validate(
      (errors: Array<FormValidationError> | undefined) => {
        if (errors) {
          // loading.value = false;
          return false;
        } else {
          // console.log("no errors");
          return true;
        }
      },
    );
  } catch (_error) {
    loading.value = false;
    return;
  };

  // if (!valid) {
  //   message.error("Rules validation failed.");
  //   loading.value = false;
  //   return;
  // }

  const isEndfield = location.value?.includes("endfield") ? "endfield/" : "";

  // todo: update this once there are other namespaces than /guides/
  $fetch(`/api/pages/guides/${isEndfield}${slug.value}`, {
    method: "PUT",
    body: {
      body: {
        title: title.value,
        description: description.value,
        author: user.value?.id,
        time: Date.now(),
        content: content.value,
      },
    },
  })
  // @ts-expect-error go away
  .then(async ({ slug }) => {
    notification.success({
      title: "Posted!",
      content: () => h(
        Link,
        { to: `/guides/${isEndfield}${slug}`, label: title.value },
        { default: () => `https://www.lungmendragons.com/guides/${isEndfield}${slug}` },
      ),
      meta: new Date(Date.now()).toLocaleString(),
    });
  })
  .catch((err) => {
    message.error(err.data.message);
  });

  message.success("Posted successfully.");

  title.value = "";
  description.value = "";
  content.value = "";
  location.value = undefined;
  slug.value = "";

  loading.value = false;

  // todo: delete from saved drafts (implement after post is working)
  // todo: navigate to post
};

onMounted(() => {
  saved.value = markdownStore.getSavedDrafts();
});
</script>

<template>
  <NFlex :style="{ width: '80%', minWidth: '500px', margin: '0 auto' }">
    <NCard title="Post Content">
      <template #header-extra>
        <NDropdown
          trigger="click"
          placement="bottom-end"
          :options="getDropdownOptions()"
          @select="handleDropdownSelect">
          <NButton
            type="primary"
            secondary>
            Load saved draft
          </NButton>
        </NDropdown>
      </template>
      <NAlert
        title="Note: 25 January 2025"
        type="info"
        :style="{ marginBottom: '1rem' }">
        Arknights guides will be posted to <strong>/guides/your-url-here</strong>.<br>
        🌟 Endfield guides will be posted to <strong>/guides/endfield/your-url-here</strong>.<br>
        Lungmen Dragons is primarily an Arknights group so the links will likely stay this way.
        Should a change ever be necessary I'll make sure they redirect automatically. <br> - Tobo
      </NAlert>
      <!-- <NAlert type="info" :style="{ marginBottom: '1rem' }">
        The post location and URL cannot be changed after the post is live.
      </NAlert> -->
      <NForm
        ref="postFormRef"
        :model="postFormValue"
        :rules="postFormRules">
        <NFlex vertical>
          <NFormItem path="title" label="Title">
            <NInput
              v-model:value="title"
              type="text"
              placeholder="Title"
              maxlength="100"
              show-count
            />
          </NFormItem>
          <NFormItem path="description" label="Description">
            <NInput
              v-model:value="description"
              type="textarea"
              placeholder="Description"
              maxlength="200"
              show-count
            />
          </NFormItem>
          <NFormItem path="content" label="Content">
            <NInput
              v-model:value="content"
              type="textarea"
              placeholder="Write something..."
              :style="{ fontFamily: 'monospace' }"
            />
          </NFormItem>
          <NFormItem path="location" label="Post Location">
            <NCascader
              v-model:value="location"
              placeholder="Where to post?"
              check-strategy="child"
              :options="postLocations"
              :style="{ width: '100%' }"
            />
          </NFormItem>
          <NFormItem path="slug" label="URL">
            <NInputGroup>
              <NInputGroupLabel>
                {{ getSlugLabel() }}
              </NInputGroupLabel>
              <NInput
                v-model:value="slug"
                placeholder="your-url-here"
              />
            </NInputGroup>
          </NFormItem>
          <NFormItem :show-feedback="false">
            <NButton
              type="primary"
              attr-type="submit"
              :style="{ width: '100px' }"
              :loading="loading"
              @click="handlePost">
              Post
            </NButton>
          </NFormItem>
        </NFlex>
      </NForm>
    </NCard>
  </NFlex>
</template>
