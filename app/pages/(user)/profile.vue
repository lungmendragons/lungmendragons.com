<script setup lang="ts">
// todo: would like to give users more customisation
// very basic profile will do for now

import type { BlobObject } from "@nuxthub/core";
import { toRef } from "@vueuse/core";

definePageMeta({
  auth: { only: "user" },
});

useSeoMeta({
  title: "Profile | Lungmen Dragons",
});

const message = useMessage();
const { client } = useAuth();
const { data: session } = await client.getSession();
const sessionRef = toRef(session);
const upload = useUpload("/api/images/avatar", { method: "PUT", multiple: false });

async function onFileSelect({ target }: Event) {
  if (session) {
    const currentAvatar = session.user.image?.slice(8); // remove "/images/"
    await upload(target as HTMLInputElement)
      .then((blob: BlobObject) => {
        client.updateUser({ image: `/images/${blob.pathname}` });
        sessionRef.value!.user.image = `/images/${blob.pathname}`;
        if (currentAvatar) {
          deleteAvatar(currentAvatar);
          message.success("Avatar uploaded.");
        }
      })
      .catch((error) => {
        message.error(error.statusMessage);
      });
  };
};

async function deleteAvatar(pathname: string) {
  // Covered by /api/images/[...pathname].delete.ts
  // @ts-expect-error - Type "DELETE" not assignable to type "PUT" | undefined
  await $fetch(`/api/images/${pathname}`, { method: "DELETE" })
    .catch((err) => {
      const error = err as Error;
      message.error(`Delete failed: ${error.message}`);
    });
};
</script>

<template>
  <NCard v-if="sessionRef" :title="sessionRef.user.name">
    <NFlex>
      <NImage
        width="150"
        height="150"
        :style="{ maxHeight: '150px', maxWidth: '150px' }"
        :src="sessionRef.user.image ?? 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'"
      />
      Joined: {{ new Date(sessionRef.user.createdAt).toUTCString() }}
      <br>
      Verified: {{ sessionRef.user.emailVerified ? "yes" : "no" }}
    </NFlex>
    <br>
    <input
      accept="jpeg, png"
      type="file"
      name="file"
      @change="onFileSelect">
    <div :style="{ fontSize: '0.7rem', margin: '4px 0' }">
      JPG or PNG, &lt;2MB, square dimensions
    </div>
  </NCard>
</template>
