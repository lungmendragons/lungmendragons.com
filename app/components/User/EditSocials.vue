<script setup lang="ts">
const { user } = useAuth();
const message = useMessage();

const socials = ref({
  youtube: removeNone(user.value?.youtube),
  bilibili: removeNone(user.value?.bilibili),
  discord: removeNone(user.value?.discord),
  bluesky: removeNone(user.value?.bluesky),
  twitter: removeNone(user.value?.twitter),
  reddit: removeNone(user.value?.reddit),
  flair: removeNone(user.value?.flair),
});

function removeNone(x: string | undefined) {
  return x === "none" ? "" : x;
}

function handleConfirmClick(e: MouseEvent) {
  e.preventDefault();
  setSocials();
};

async function setSocials() {
  $fetch(`/api/users/socials/${user.value?.id}`, {
    method: "PUT",
    body: socials.value,
  })
    .then(async () => {
      user.value!.youtube = socials.value.youtube ?? "";
      user.value!.bilibili = socials.value.bilibili ?? "";
      user.value!.discord = socials.value.discord ?? "";
      user.value!.bluesky = socials.value.bluesky ?? "";
      user.value!.twitter = socials.value.twitter ?? "";
      user.value!.reddit = socials.value.reddit ?? "";
      user.value!.flair = socials.value.flair ?? "";
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
