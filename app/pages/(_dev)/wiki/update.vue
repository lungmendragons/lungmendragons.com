<script setup lang="ts">
import { Octokit } from "octokit";

definePageMeta({
  auth: { only: "admin" },
});

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

const akr: Array<{
  path: string;
  filter: string[] | null;
  blobs: Ref<number>;
  found: Ref<number>;
}> = [
  {
    path: "avatar/ASSISTANT",
    filter: [ "char_", "token_" ],
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "camplogo",
    filter: null,
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "charpack",
    filter: [ "char_" ],
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "charpor",
    filter: null,
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "equip",
    filter: null,
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "equipt",
    filter: null,
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "equiptc",
    filter: null,
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "items",
    filter: [ "MTL_" ],
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "kvimg",
    filter: [ "brand_" ],
    blobs: ref(0),
    found: ref(0),
  },
  {
    path: "skills",
    filter: null,
    blobs: ref(0),
    found: ref(0),
  },
];

const miniConsole = ref("");
const loading = ref(true);

async function update(f: {
  path: string;
  filter: string[] | null;
  blobs: Ref<number>;
  found: Ref<number>;
}): Promise<void> {
  miniConsole.value += `Update requested: /${f.path}\n`;
  octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "fexli",
    repo: "ArknightsResource",
    path: f.path,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).then((res: any) => {
    miniConsole.value += `Processing ${res.data.length} files...\n`;
    f.found.value = res.data.length;
    updateFolder(f.path, f.filter, res.data);
  });
}

async function updateFolder(path: string, filter: string[] | null, files: any[]): Promise<void> {
  const formData = new FormData();
  for (const file of files) {
    if (file.type !== "file") {
      miniConsole.value += `! skipped ${file.name} (bad type)\n`;
      continue;
    }
    if (filter && !filter.some(prefix => file.name.startsWith(prefix))) {
      miniConsole.value += `! skipped ${file.name} (filtered prefix)\n`;
      continue;
    }

    const response = await fetch(file.download_url);
    const blob = await response.blob();
    formData.append("files", blob, `${path}/${file.name}`);
  }

  $fetch(`/api/assets/update`, {
    method: "PUT",
    body: formData,
  }).then((res) => {
    miniConsole.value += `${res}\n`;
  });
}

onBeforeMount(() => {
  for (const f of akr) {
    $fetch(`/api/assets/blob/${f.path}`, { method: "GET" })
      .then((res: any) => f.blobs.value = res);
  }
});

onMounted(() => {
  octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
    owner: "fexli",
    repo: "ArknightsResource",
    tree_sha: "df6c6721e17fbd62428d681efbe6d6dbcc289948", // temporary - replace with func to get latest sha
    recursive: "true",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).then((res) => {
    for (const f of akr) {
      f.found.value = res.data.tree.filter((item: any) => {
        return item.path.startsWith(f.path)
          && item.type === "blob"
          && (!f.filter || f.filter.some(prefix => item.path.includes(prefix)));
      }).length;
    }
  }).catch((err) => {
    miniConsole.value = `Error: ${err}\n`;
  }).finally(() => {
    loading.value = false;
    miniConsole.value += "Ready\n";
  });
});
</script>

<template>
  <NFlex vertical>
    <NFlex
      v-for="f of akr"
      :key="f.path"
      align="center">
      <NButton style="width:150px" @click="update(f)">
        {{ f.path }}
      </NButton>
      <div v-if="loading">
        Please wait...
      </div>
      <div v-else :style="{ color: f.blobs.value === f.found.value ? 'unset' : 'red' }">
        {{ f.blobs }}/{{ f.found }}
      </div>
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
  height: 250px;
  overflow: scroll;
  width: 600px;
  padding: 0 8px;
  background-color: #0003;
}
</style>
