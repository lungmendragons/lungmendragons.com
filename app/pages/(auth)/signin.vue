<script setup lang="ts">
import type { FormInst } from "naive-ui";

definePageMeta({
  auth: { only: "guest" },
});

useSeoMeta({
  title: "Sign in | Lungmen Dragons",
});

const signInFormInst = ref<FormInst | null>(null);

const signInForm = ref({
  emailOrUsername: "",
  password: "",
});

const rules = {
  emailOrUsername: {
    required: true,
    message: "Please input your email or username",
  },
  password: {
    required: true,
    message: "Please input your password",
  },
};

const loading = ref(false);

const notification = useNotification();
const { client } = useAuth();

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

  let data: any;

  if (signInForm.value?.emailOrUsername.includes("@")) {
    data = await client.signIn.email({
      email: signInForm.value?.emailOrUsername,
      password: signInForm.value?.password,
    });
  } else {
    data = await client.signIn.username({
      username: signInForm.value?.emailOrUsername,
      password: signInForm.value?.password,
    });
  };

  if (data.error) {
    notification.error({
      title: "Sign in failed",
      content: JSON.stringify(data.error),
    });
  } else {
    await navigateTo("/profile");
    notification.success({ content: "Signed in.", duration: 5000 });
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
            v-model:value="signInForm.emailOrUsername"
            placeholder="Email or username"
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
