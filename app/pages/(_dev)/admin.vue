<script setup lang="ts">
definePageMeta({
  auth: { only: "admin" },
});

const message = useMessage();
const loading = ref(false);
const id = ref("");

function updateYT() {
  loading.value = true;
  $fetch("/api/pages/home/yt", {
    method: "PUT",
    body: id.value,
  })
    .then((res) => {
      if (res === "success") {
        message.success("Homepage YouTube video updated.");
        loading.value = false;
      } else if (res === "error") {
        message.error("Failed to update homepage YouTube video - returned error.");
        loading.value = false;
      }
    })
    .catch((err) => {
      message.error("Failed to update homepage YouTube video - error caught.");
      console.error(err);
      loading.value = false;
    });
}
</script>

<template>
  <div>
    youtube id for homepage (ID ONLY - NOT THE FULL URL)
    <NInput v-model:value="id" />
    <NButton @click="updateYT" :loading="loading">
      update
    </NButton>
  </div>
</template>
