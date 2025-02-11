<script setup lang="ts">
definePageMeta({
  auth: { only: "admin" },
});

const updates = ref();
const status = ref("");

onMounted(() => {
  status.value = "Fetching data...";
  $fetch<any[]>("/api/pages/sgl2/updates", { method: "GET" })
    .then((data) => {
      status.value = "Data fetched";
      updates.value = data.map((item) => {
        return {
          ...item,
          time: typeof item.time === "number"
            ? new Date(item.time).toLocaleString("en-GB")
            : item.time,
          payload: item.payload.scheduledTime
            ? { scheduledTime: new Date(item.payload.scheduledTime).toLocaleString("en-GB") }
            : item.payload,
        };
      });
    });
})
</script>

<template>
  <div>
    <pre>{{ status }}</pre>
    <pre>{{ JSON.stringify(updates, null, 2) }}</pre>
  </div>
</template>
