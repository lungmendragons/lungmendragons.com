<script setup lang="ts">
import { NTime } from "naive-ui";

definePageMeta({
  auth: { only: "admin" },
});

const message = useMessage();
const loading = ref(false);
const id = ref("");
const suggestions = ref<any[]>([]);

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
      } else if (res === "empty") {
        message.error("Failed to update homepage YouTube video - item list empty.");
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

const cols = [
  {
    title: "User",
    key: "user.name",
  },
  {
    title: "Time",
    key: "time",
    render(row: any) {
      return h(NTime, { time: new Date(row.time) });
    },
  },
  {
    title: "Title",
    key: "data.title",
  },
  {
    title: "Description",
    key: "data.description",
  },
  {
    title: "Link",
    key: "data.link",
  },
  
  {
    title: "Author",
    key: "data.author",
  },
];

onMounted(() => {
  $fetch("/api/pages/suggest", { method: "GET" })
    .then((res) => {
      suggestions.value = res;
    })
    .catch((err) => {
      console.error(err);
    });
});
</script>

<template>
  <NFlex vertical>
    <NFlex vertical class="w-[300px]">
      youtube id for homepage
      <br>
      (ID ONLY - NOT THE FULL URL)
      <NInput v-model:value="id" />
      <NButton @click="updateYT" :loading="loading">
        update
      </NButton>
    </NFlex>
    <hr class="my-4">
    <div class="text-2xl font-bold">
      Resource Index suggestions
    </div>
    <NDataTable
      :data="suggestions"
      :columns="cols"
    />
  </NFlex>
</template>
