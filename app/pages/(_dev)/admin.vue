<script setup lang="ts">
definePageMeta({
  auth: { only: "admin" },
});

const message = useMessage();
const loading = ref(false);

function fetchYT() {
  loading.value = true;
  $fetch("/api/pages/home/yt", { method: "PUT" })
    .then((res) => {
      if (res === "success") {
        message.success("Homepage YouTube video updated.");
        loading.value = false;
      }
    })
    .catch((err) => {
      message.error("Failed to update homepage YouTube video.");
      console.error(err);
      loading.value = false;
    });
}
</script>

<template>
  <div>
    <NButton @click="fetchYT" :loading="loading">
      /api/pages/home/yt
    </NButton>
  </div>
</template>
