<script setup lang="ts">
// todo: would like to give users more customisation
// very basic profile will do for now

import type { UploadCustomRequestOptions, UploadInst } from "naive-ui";

definePageMeta({
  auth: { only: "user" },
});

useSeoMeta({
  title: "Profile | Lungmen Dragons",
});

const { user, client } = useAuth();

const message = useMessage();
const uploadRef = ref<UploadInst>();
const upload = useUpload("/api/images/avatar", { method: "PUT", multiple: false });
const showEditSocials = ref(false);

async function onFileSelect({ file }: UploadCustomRequestOptions): Promise<void> {
  if (user.value) {
    const currentAvatar = user.value?.image;
    await upload(file.file as File)
      .then((blob) => {
        client.updateUser({ image: `/images/${blob.pathname}` });
        user.value!.image = `/images/${blob.pathname}`;
        if (currentAvatar) {
          deleteAvatar(currentAvatar.slice(8)); // remove "/images/" from pathname
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
  <NCard v-if="user" :title="user.name">
    <NFlex>
      <NImage
        width="150"
        height="150"
        :style="{ maxHeight: '150px', maxWidth: '150px' }"
        :src="user.image ?? 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'"
      />
      <NFlex vertical>
        <div v-if="!user.flair || user.flair !== 'none'">
          <em>{{ user.flair }}</em>
        </div>
        <span>
          Joined: {{ new Date(user.createdAt).toUTCString() }}
        </span>
        <span>
          Verified: {{ user.emailVerified ? "yes" : "no" }}
        </span>
        <UserSocials
          :youtube="user.youtube"
          :bilibili="user.bilibili"
          :discord="user.discord"
          :bluesky="user.bluesky"
          :twitter="user.twitter"
          :reddit="user.reddit"
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
