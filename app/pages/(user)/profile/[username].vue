<script setup lang="ts">
// todo: would like to give users more customisation
// very basic profile will do for now

useSeoMeta({
  title: "Profile | Lungmen Dragons",
});

const username = useRoute().params.username;
const userRef = ref({
  name: "",
  image: "",
  createdAt: "",
  youtube: "",
  bilibili: "",
  discord: "",
  bluesky: "",
  twitter: "",
  reddit: "",
});

onMounted(() => {
  // todo: improve this fetch, ugly as hell, feels inefficient
  $fetch(`/api/users/profile/${username}`)
    .then((user: any) => {
      console.log(user);
      userRef.value = user;
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<template>
  <NCard v-if="userRef.name" :title="userRef.name">
    <NFlex>
      <NImage
        width="150"
        height="150"
        :style="{ maxHeight: '150px', maxWidth: '150px' }"
        :src="userRef.image ?? 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'"
      />
      <NFlex vertical>
        <span>
          Joined: {{ new Date(userRef.createdAt).toUTCString() }}
        </span>
        <UserSocials
          :youtube="userRef.youtube"
          :bilibili="userRef.bilibili"
          :discord="userRef.discord"
          :bluesky="userRef.bluesky"
          :twitter="userRef.twitter"
          :reddit="userRef.reddit"
        />
      </NFlex>
    </NFlex>
  </NCard>
</template>
