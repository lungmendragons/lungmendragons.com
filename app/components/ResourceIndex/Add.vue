<script setup lang="ts">
import { nanoid } from "nanoid";
import type { FormInst } from "naive-ui";
import type { Tool } from "~/utils/resources/tools";

const { item } = defineProps<{
  item?: {
    id: string;
    data: Tool;
  };
}>();
const key = item?.id ?? nanoid(8);
const formRef = ref<FormInst | null>(null);
const message = useMessage();

const formValue = ref(item?.data ?? {
  name: null,
  description: null,
  category: null,
  languages: null,
  author: null,
  url: null,
  recommended: false,
  dead: false,
  success: null,
  info: null,
  warning: null,
  error: null,
});

const rules = {
  name: { required: true },
  description: { required: true },
  category: { required: true },
  languages: { required: true },
  author: { required: true },
  url: { required: true },
};

const categoryOptions = [
  {
    label: "Tools",
    value: "tools",
  },
  {
    label: "Spreadsheets",
    value: "sheets",
  },
  {
    label: "Assets",
    value: "assets",
  },
  {
    label: "Wikis",
    value: "wiki",
  },
  {
    label: "Software",
    value: "code",
  },
  {
    label: "Just For Fun",
    value: "fun",
  },
  {
    label: "Emulators (etc)",
    value: "emu",
  },
  {
    label: "Other",
    value: "other",
  },
];

const languageOptions = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "简体中文",
    value: "cn",
  },
  {
    label: "繁體中文",
    value: "tw",
  },
  {
    label: "日本語",
    value: "jp",
  },
  {
    label: "한국어",
    value: "kr",
  },
];

function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      putResource();
    } else {
      console.log(errors);
      message.error("Invalid");
    }
  });
};

async function putResource() {
  $fetch("/api/pages/resources", {
    method: "PUT",
    body: { key, data: formValue.value },
  })
    // @ts-expect-error "key" does not exist on type {}
    .then(async ({ key }) => {
      message.success(`Added: ${key.slice(-8)}`);
    })
    .catch((err) => {
      message.error(err.message);
    });
}
</script>

<template>
  <NDrawerContent title="Add a resource" closable>
    <NForm
      ref="formRef"
      :model="formValue"
      :rules="rules">
      <NFormItem label="Name" path="name">
        <NInput
          v-model:value="formValue.name"
          placeholder="Name"
        />
      </NFormItem>
      <NFormItem label="Description" path="description">
        <NInput
          v-model:value="formValue.description"
          type="textarea"
          placeholder="Description"
        />
      </NFormItem>
      <NFormItem label="Category" path="category">
        <NSelect
          v-model:value="formValue.category"
          placeholder="Category"
          :options="categoryOptions"
        />
      </NFormItem>
      <NFormItem label="Languages" path="languages">
        <NSelect
          v-model:value="formValue.languages"
          placeholder="Languages"
          multiple
          :options="languageOptions"
        />
      </NFormItem>
      <NFormItem label="Author" path="author">
        <NInput
          v-model:value="formValue.author"
          placeholder="Author"
        />
      </NFormItem>
      <NFormItem label="URL" path="url">
        <NInput
          v-model:value="formValue.url"
          placeholder="URL"
        />
      </NFormItem>
      <NFormItem label="Recommended?" path="recommended">
        <NSwitch v-model:value="formValue.recommended" />
        <span class="text-xs ml-2">
          Note: if you mark a resource as recommended, please add a <strong>Success card</strong>
          stating <strong>"Recommended."</strong> as a bare minimum. You can add reasons if you want.
        </span>
      </NFormItem>
      <NFormItem label="Dead resource?" path="dead">
        <NSwitch v-model:value="formValue.dead" />
        <span class="text-xs ml-2">
          Note: if you mark a resource as dead, please add a <strong>Danger card</strong>
          stating the approximate month/year it stopped being maintained.
        </span>
      </NFormItem>
      <NFormItem label="Success card?" path="success">
        <NInput
          v-model:value="formValue.success"
          type="textarea"
          placeholder="Success card (green) - for recommended resources"
        />
      </NFormItem>
      <NFormItem label="Danger card?" path="error">
        <NInput
          v-model:value="formValue.error"
          type="textarea"
          placeholder="Danger card (red) - for dead resources"
        />
      </NFormItem>
      <NFormItem label="Info card?" path="info">
        <NInput
          v-model:value="formValue.info"
          type="textarea"
          placeholder="Info card (blue) - for noteworthy information"
        />
      </NFormItem>
      <NFormItem label="Warning card?" path="warning">
        <NInput
          v-model:value="formValue.warning"
          type="textarea"
          placeholder="Warning card (yellow) - for important information, warnings, possible minor consequences"
        />
      </NFormItem>
      <NFormItem>
        <NButton @click="handleValidateClick">
          Validate
        </NButton>
      </NFormItem>
    </NForm>
  </NDrawerContent>
</template>
