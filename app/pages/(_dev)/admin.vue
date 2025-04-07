<script setup lang="ts">
definePageMeta({
  auth: { only: "admin" },
});

const message = useMessage();
const loading = ref(false);

const recent = await $fetch("/api/pages/home/yt", { method: "GET" }) as any;
const updated = ref();

function updateYT() {
  loading.value = true;
  $fetch("/api/pages/home/yt", { method: "PUT" })
    .then((res) => {
      if (res.kind === "youtube#playlistItemListResponse") {
        updated.value = res;
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
    <NButton @click="updateYT" :loading="loading">
      update
    </NButton>
    <div class="my-4">
      Current homepage video:
      <br>
      <span class="font-bold">
        {{ recent.items[0].snippet.title }}
      </span>
      <br>
      Newly updated homepage video:
      <br>
      <span class="font-bold">
        {{ updated ? updated.items[0].snippet.title : "--" }}
      </span>
    </div>
  </div>
</template>
