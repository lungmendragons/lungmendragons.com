<script setup lang="ts">
import type { FormInst } from "naive-ui";

const {
  modal,
  session,
} = defineProps<{
  modal: any;
  session: any;
}>();

const formRef = ref<FormInst | null>(null);
const message = useMessage();

const formValue = ref({
  title: "",
  description: "",
  link: "",
  author: "",
});

const rules = {
  title: {
    required: true,
    message: "Required",
    trigger: [ "input" ],
  },
  description: {
    required: true,
    message: "Required",
    trigger: [ "input" ],
  },
  link: {
    required: true,
    message: "Required",
    trigger: [ "input" ],
  },
  author: {
    required: true,
    message: "Required",
    trigger: [ "input" ],
  },
};

function submitSuggestion(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors)
      doSubmit();
  });
}

function doSubmit() {
  $fetch("/api/pages/suggest", {
    method: "PUT",
    body: {
      data: formValue.value,
      user: {
        id: session.value?.user.id,
        name: session.value?.user.name,
      },
      time: Date.now(),
    },
  }).then(async (res) => {
    res === "success"
      ? message.success("Suggested")
      : message.error("Error");
    modal.destroy();
  }).catch((err) => {
    message.error(err.message);
  });
}
</script>

<template>
  <NFlex vertical>
    <span class="text-xs mb-2">
      Please provide as much info as you can,
      and note that suggestions do not guarantee additions.
    </span>
    <NForm
      v-if="session.value?.user.id"
      ref="formRef"
      :model="formValue"
      :rules="rules">
      <NFormItem
        label="Title"
        path="title"
        feedback-style="margin-bottom:0.5rem">
        <NInput v-model:value="formValue.title" placeholder="Title" />
      </NFormItem>
      <NFormItem
        label="Description"
        path="description"
        feedback-style="margin-bottom:0.5rem">
        <NInput
          v-model:value="formValue.description"
          placeholder="Description"
          type="textarea"
        />
      </NFormItem>
      <NFormItem
        label="Author(s)"
        path="author"
        feedback-style="margin-bottom:0.5rem">
        <NInput v-model:value="formValue.author" placeholder="Author(s)" />
      </NFormItem>
      <NFormItem
        label="Link"
        path="link"
        feedback-style="margin-bottom:0.5rem">
        <NInput v-model:value="formValue.link" placeholder="Link" />
      </NFormItem>
      <NFormItem :show-label="false" :show-feedback="false">
        <NButton type="primary" @click="submitSuggestion">
          Submit suggestion
        </NButton>
      </NFormItem>
    </NForm>
    <div v-else>
      <NAlert type="error">
        You must be logged in to use this feature.
      </NAlert>
    </div>
  </NFlex>
</template>
