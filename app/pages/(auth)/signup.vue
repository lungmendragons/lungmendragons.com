<script setup lang="ts">
import type { FormInst } from "naive-ui";

definePageMeta({
  auth: { only: "guest" },
});

const signUpFormInst = ref<FormInst | null>(null);

const signUpForm = ref({
  username: "",
  email: "",
  password: "",
});

const rules = {
  username: {
    required: true,
    message: "Please input your username",
  },
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

async function handleSignUp(event: MouseEvent) {
  event.preventDefault();

  if (loading.value)
    return;

  loading.value = true;

  const isValid = signUpFormInst.value?.validate((errors) => {
    if (errors) {
      notification.error({
        title: "Rules validation failed",
        content: JSON.stringify(errors),
      });
      return false;
    } else {
      return true;
    }
  });

  if (!isValid) {
    loading.value = false;
    return;
  }

  const { error } = await auth.signUp.email({
    email: signUpForm.value?.email,
    password: signUpForm.value?.password,
    // "name" is a required field, so treat is as username
    name: signUpForm.value?.username,
  });

  if (error) {
    notification.error({
      title: "Sign up failed",
      content: JSON.stringify(error),
    });
  } else {
    await navigateTo("/profile");
    notification.success({ content: "Signed up." });
  }

  loading.value = false;
}
</script>

<template>
  <NFlex justify="center">
    <NCard :style="{ maxWidth: '320px' }">
      <NForm
        ref="signUpFormInst"
        require-mark-placement="right-hanging"
        :rules="rules"
        :model="signUpForm">
        <NFormItem
          path="username"
          :show-label="false"
          :feedback-style="{ fontSize: '0.7rem' }">
          <NInput
            v-model:value="signUpForm.username"
            placeholder="Username"
          />
        </NFormItem>
        <NFormItem
          path="email"
          :show-label="false"
          :feedback-style="{ fontSize: '0.7rem' }">
          <NInput
            v-model:value="signUpForm.email"
            placeholder="Email"
          />
        </NFormItem>
        <NFormItem
          path="password"
          :show-label="false"
          :feedback-style="{ fontSize: '0.7rem' }">
          <NInput
            v-model:value="signUpForm.password"
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
            @click="handleSignUp">
            Sign Up
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </NFlex>
</template>
