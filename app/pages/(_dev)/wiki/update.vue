<script setup lang="ts">
import { NButton } from "naive-ui";

definePageMeta({
  auth: { only: "admin" },
});

// const { data } = await useFetch(`/api/assets/${opObj.id}`);

// const akrPath = "submodules/ArknightsResource/";
const akr: Array<[string, Ref<number>, Ref<number>]> = [
  [ "camplogo", ref(0), ref(0) ],
  [ "charpor", ref(0), ref(0) ],
  [ "equip", ref(0), ref(0) ],
  [ "equipt", ref(0), ref(0) ],
  [ "equiptc", ref(0), ref(0) ],
  [ "skills", ref(0), ref(0) ],
  [ "avatar/ASSISTANT", ref(0), ref(0) ],
  [ "charpack", ref(0), ref(0) ],
  [ "items", ref(0), ref(0) ],
  [ "kvimg", ref(0), ref(0) ],
];

const miniConsole = ref("");

async function update(f: [string, Ref<number>, Ref<number>]) {
  $fetch(`/api/assets/${f[0]}`, { method: "GET" })
    .then((res) => {
      miniConsole.value += `Processing ${res} files in /${f[0]} ...\n`;
      f[1].value = res;
      updateFolder(f[0]);
    });
}

async function updateFolder(f: string) {
  $fetch(`/api/assets/update/${f}`, { method: "PUT" })
    .then((res) => {
      miniConsole.value += `${res}\n`;
    });
}

// onMounted(() => {
//   akr.forEach((f) => {
//     checkFolder(f[0]).then((n) => {
//       f[2].value = n;
//     });
//   });
// });

// async function checkFolder(f: string) {
//   const n = await $fetch(`/api/assets/update/${f}`, { method: "GET" });
//   return n;
// }
</script>

<template>
  <NFlex vertical>
    <NFlex
      v-for="f of akr"
      :key="f[0]"
      align="center">
      <NButton style="width:150px" @click="update(f)">
        {{ f[0] }}
      </NButton>
      <!-- {{ f[2] }}/{{ f[1] }} -->
      <!-- <NSpin size="small" :show="f[1]" /> -->
    </NFlex>
    <div id="console">
      <div>
        <pre>{{ miniConsole }}</pre>
      </div>
    </div>
  </NFlex>
</template>

<style scoped>
#console {
  display: flex;
  flex-direction: column-reverse;
  height: 300px;
  overflow: scroll;
  width: 500px;
  padding: 0 8px;
  background-color: #0003;
}
</style>
