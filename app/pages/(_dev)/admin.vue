<script setup lang="ts">
definePageMeta({
  auth: { only: "admin" },
});

const message = useMessage();
const loading = ref(false);
const loading2 = ref(false);
const thing = ref({});

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

function fetchTest() {
  loading2.value = true;
  $fetch("/api/pages/test/thing", { method: "PUT" })
    .then((res) => {
      console.log(res);
      thing.value = res;
      loading2.value = false;
    })
    .catch((err) => {
      message.error("Failed");
      console.error(err);
      loading2.value = false;
    });
}
</script>

<template>
  <div>
    <NButton @click="fetchYT" :loading="loading">
      /api/pages/home/yt
    </NButton>
    <NButton @click="fetchTest" :loading="loading">
      /api/pages/test/thing
    </NButton>
    <pre>{{ JSON.stringify(thing, null, 2) }}</pre>
  </div>
</template>
