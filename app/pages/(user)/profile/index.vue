<script setup lang="ts">
// todo: would like to give users more customisation
// very basic profile will do for now

import type { UploadCustomRequestOptions, UploadInst } from "naive-ui";
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
const uploadRef = ref<UploadInst>();
const upload = useUpload("/api/images/avatar", { method: "PUT", multiple: false });
const showEditSocials = ref(false);

async function onFileSelect({ file }: UploadCustomRequestOptions): Promise<void> {
  if (session) {
    const currentAvatar = session.user.image?.slice(8); // remove "/images/" from pathname
    await upload(file.file as File)
      .then((blob: BlobObject) => {
        client.updateUser({ image: `/images/${blob.pathname}` });
        sessionRef.value!.user.image = `/images/${blob.pathname}`;
        if (currentAvatar) {
          deleteAvatar(currentAvatar);
          message.success("Avatar uploaded.");
        }
      })
      .catch((error) => {
        message.error(`Upload failed: ${error.statusMessage}`);
      });

    // if not cleared then it'll upload an array of files if user changes it again
    // immediately after, because of how the naive-ui component works
    uploadRef.value?.clear();
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
      <NFlex vertical>
        <span>
          Joined: {{ new Date(sessionRef.user.createdAt).toUTCString() }}
        </span>
        <span>
          Verified: {{ sessionRef.user.emailVerified ? "yes" : "no" }}
        </span>
        <UserSocials
          :youtube="sessionRef.user.youtube"
          :bilibili="sessionRef.user.bilibili"
          :discord="sessionRef.user.discord"
          :bluesky="sessionRef.user.bluesky"
          :twitter="sessionRef.user.twitter"
          :reddit="sessionRef.user.reddit"
        />
        <NButton
          type="primary"
          size="small"
          style="width:128px"
          @click="showEditSocials = true">
          Edit socials
        </NButton>
      </NFlex>
    </NFlex>
    <br>
    <NUpload
      ref="uploadRef"
      name="file"
      accept="image/jpeg,image/png"
      :show-file-list="false"
      :custom-request="onFileSelect">
      <NButton type="primary">
        Update avatar
      </NButton>
    </NUpload>
    <div :style="{ fontSize: '0.7rem', margin: '4px 0' }">
      JPG or PNG, max 2 MB
    </div>
    <NDrawer
      v-model:show="showEditSocials"
      to="#page-content-container"
      placement="right"
      :width="360">
      <UserEditSocials />
    </NDrawer>
  </NCard>
</template>
