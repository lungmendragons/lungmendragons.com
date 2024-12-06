<script setup lang="ts">
import { toRef } from "@vueuse/core";

const { client, user } = useAuth();
const { data: session } = await client.getSession();
const sessionRef = toRef(session);
const message = useMessage();
const notification = useNotification();

const socials = ref({
  youtube: removeNone(sessionRef.value!.user.youtube),
  bilibili: removeNone(sessionRef.value!.user.bilibili),
  discord: removeNone(sessionRef.value!.user.discord),
  bluesky: removeNone(sessionRef.value!.user.bluesky),
  twitter: removeNone(sessionRef.value!.user.twitter),
  reddit: removeNone(sessionRef.value!.user.reddit),
});

function removeNone(x: string) {
  return x === "none" ? "" : x;
}

function handleConfirmClick(e: MouseEvent) {
  e.preventDefault();
  setSocials();
};

async function setSocials() {
  message.info(`socials.youtube: ${socials.value.youtube}`);
  $fetch(`/api/users/socials/${user.value?.id}`, {
    method: "PUT",
    body: socials.value,
  })
    .then(async () => {
      sessionRef.value!.user.youtube = socials.value.youtube;
      sessionRef.value!.user.bilibili = socials.value.bilibili;
      sessionRef.value!.user.discord = socials.value.discord;
      sessionRef.value!.user.bluesky = socials.value.bluesky;
      sessionRef.value!.user.twitter = socials.value.twitter;
      sessionRef.value!.user.reddit = socials.value.reddit;
      notification.success({ content: "Socials updated." });
    })
    .catch((err) => {
      message.error(err.message);
    });
}
</script>

<template>
  <NDrawerContent title="Edit socials" closable>
    <NFlex vertical>
      <NInput v-model:value="socials.youtube" placeholder="youtube" />
      <NInput v-model:value="socials.bilibili" placeholder="bilibili" />
      <NInput v-model:value="socials.discord" placeholder="discord" />
      <NInput v-model:value="socials.bluesky" placeholder="bluesky" />
      <NInput v-model:value="socials.twitter" placeholder="twitter" />
      <NInput v-model:value="socials.reddit" placeholder="reddit" />
      <NButton @click="handleConfirmClick">
        Confirm
      </NButton>
    </NFlex>
  </NDrawerContent>
</template>
