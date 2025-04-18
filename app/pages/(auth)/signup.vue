<script setup lang="ts">
import type { FormInst, FormItemRule } from "naive-ui";

definePageMeta({
  auth: { only: AuthPermission.Guest },
});

useSeoMeta({
  title: "Sign up | Lungmen Dragons",
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
    validator: (_rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        const match = value.match(/([a-z0-9])+/gi);
        // Ugly but I don't care rn
        if (value.length === 0) {
          reject(new Error("Must not be empty."));
        } else if (!match || match.length > 1 || match[0] !== value) {
          reject(new Error("Contains invalid characters. Must only contain letters or numbers."));
        } else if (match[0].length < 5) {
          reject(new Error("Must be at least 5 characters."));
        } else {
          resolve();
        };
      });
    },
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
const { client } = useAuth();

async function isUsernameAvailable(username: string): Promise<boolean> {
  const result = await $fetch(`/api/users/profile/${username}`);
  return result === undefined;
}

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

  if (!await isUsernameAvailable(signUpForm.value?.username)) {
    notification.error({
      title: "Username is taken",
      content: "Please choose another username.",
    });
    loading.value = false;
    return;
  }

  const { error } = await client.signUp.email({
    email: signUpForm.value?.email,
    password: signUpForm.value?.password,
    // "name" is a required field regardless, so just make it identical to the username
    // because signing in with username specifically requires "username" field
    name: signUpForm.value?.username,
    username: signUpForm.value?.username,
  });

  if (error) {
    if (error.message === "User with this email already exists") {
      notification.error({
        title: "Email already in use",
        content: `Error ${error.status}: ${error.message}`,
      });
    } else if (error.status === 422) {
      notification.error({
        title: "Username is taken",
        content: `Error ${error.status}: ${error.message}`,
      });
    } else {
      notification.error({
        title: "Sign up failed",
        content: `Error ${error.status}: ${error.message}`,
      });
    }
  } else {
    await navigateTo("/profile");
    notification.success({ content: "Signed up.", duration: 5000 });
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
