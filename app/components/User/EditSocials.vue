<script setup lang="ts">
const { client } = useAuth();
const { data: session } = await client.useSession(useFetch);
const message = useMessage();

const socials = ref({
  youtube: removeNone(session.value?.user.youtube),
  bilibili: removeNone(session.value?.user.bilibili),
  discord: removeNone(session.value?.user.discord),
  bluesky: removeNone(session.value?.user.bluesky),
  twitter: removeNone(session.value?.user.twitter),
  reddit: removeNone(session.value?.user.reddit),
  flair: removeNone(session.value?.user.flair),
});

function removeNone(x: string | undefined) {
  return x === "none" ? "" : x;
}

function handleConfirmClick(e: MouseEvent) {
  e.preventDefault();
  setSocials();
};

async function setSocials() {
  $fetch(`/api/users/socials/${session.value?.user.id}`, {
    method: "PUT",
    body: socials.value,
  })
    .then(async () => {
      session.value!.user.youtube = socials.value.youtube ?? "";
      session.value!.user.bilibili = socials.value.bilibili ?? "";
      session.value!.user.discord = socials.value.discord ?? "";
      session.value!.user.bluesky = socials.value.bluesky ?? "";
      session.value!.user.twitter = socials.value.twitter ?? "";
      session.value!.user.reddit = socials.value.reddit ?? "";
      session.value!.user.flair = socials.value.flair ?? "";
      message.success("Socials updated.");
    })
    .catch((err) => {
      message.error(err.message);
    });
}
</script>

<template>
  <NDrawerContent title="Edit socials" closable>
    <NFlex vertical>
      All fields are optional.
      <NDivider />
      <NInput v-model:value="socials.youtube" placeholder="youtube (link)" />
      <NInput v-model:value="socials.bilibili" placeholder="bilibili (link)" />
      <NInput v-model:value="socials.discord" placeholder="discord (username)" />
      <NInput v-model:value="socials.bluesky" placeholder="bluesky (link)" />
      <NInput v-model:value="socials.twitter" placeholder="twitter (link)" />
      <NInput v-model:value="socials.reddit" placeholder="reddit (link)" />
      <NDivider />
      <NInput v-model:value="socials.flair" placeholder="flair/caption" />
      <NDivider />
      <NButton @click="handleConfirmClick">
        Confirm
      </NButton>
    </NFlex>
  </NDrawerContent>
</template>
