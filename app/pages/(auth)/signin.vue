<script setup lang="ts">
import type { FormInst } from "naive-ui";

definePageMeta({
  auth: { only: "guest" },
});

const signInFormInst = ref<FormInst | null>(null);

const signInForm = ref({
  email: "",
  password: "",
});

const rules = {
  email: {
    required: true,
    message: "Please input your email",
  },
  password: {
    required: true,
    message: "Please input your password",
  },
};

const loading = ref(false);

const notification = useNotification();
const auth = useAuth();

async function handleSignIn(event: MouseEvent) {
  event.preventDefault();

  if (loading.value)
    return;

  loading.value = true;

  const isValid = signInFormInst.value?.validate((errors) => {
    if (errors) {
      notification.error({
        title: "Rules validation failed",
        content: JSON.stringify(errors),
      });
      return false;
    } else {
      return true;
    };
  });

  if (!isValid) {
    loading.value = false;
    return;
  };

  const { error } = await auth.signIn.email({
    email: signInForm.value?.email,
    password: signInForm.value?.password,
  });

  if (error) {
    notification.error({
      title: "Sign in failed",
      content: JSON.stringify(error),
    });
  } else {
    await navigateTo("/profile");
    notification.success({ content: "Signed in." });
  };

  loading.value = false;
}
</script>

<template>
  <NFlex justify="center">
    <NCard :style="{ maxWidth: '320px' }">
      <NForm
        ref="signInFormInst"
        require-mark-placement="right-hanging"
        :rules="rules"
        :model="signInForm">
        <NFormItem
          path="email"
          :show-label="false"
          :feedback-style="{ fontSize: '0.7rem' }">
          <NInput
            v-model:value="signInForm.email"
            placeholder="Email"
          />
        </NFormItem>
        <NFormItem
          path="password"
          :show-label="false"
          :feedback-style="{ fontSize: '0.7rem' }">
          <NInput
            v-model:value="signInForm.password"
            type="password"
            placeholder="Password"
          />
        </NFormItem>
        <NFormItem
          :show-label="false"
          :show-feedback="false">
          <NButton
            attr-type="submit"
            type="primary"
            :loading="loading"
            :style="{ width: '100%' }"
            @click="handleSignIn">
            Sign In
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </NFlex>
</template>
