<script setup lang="ts">
const KVs = ref<[{
  key: string;
  data: {
    title: string;
    description: string;
    content: string;
    time: number;
    author: Ref<string>;
    authorImage?: Ref<string>;
  };
}] | []>([]);

// This block is a complete mess and I make no apology for it. If you can
// do this without TypeScript insulting your bloodline in your IDE then you
// should probably be making more important things than an Arknights website.
onMounted(() => {
  $fetch("/api/pages")
    .then((kvArray) => {
      kvArray.forEach((item) => {
        console.log(item);
        const name = ref<string>("");
        const image = ref<string>("");
        // @ts-expect-error possibly null/not assignable/property does not exist
        $fetch(`/api/users/${item.data.author}`).then(user => name.value = user.name);
        // @ts-expect-error as above
        $fetch(`/api/users/${item.data.author}`).then(user => image.value = user.image);
        // @ts-expect-error leave me alone
        KVs.value.push({ key: item.key, data: { ...item.data, author: name, authorImage: image } });
      });
    })
    .then(() => console.log(KVs));
});

function getDateString(time: number): string {
  return new Date(time).toLocaleString(
    undefined,
    { weekday: "short", day: "numeric", month: "long", year: "numeric" },
  );
};
</script>

<template>
  <NFlex class="w-full md:w-4/5 max-w-[800px] mx-auto">
    <NList hoverable clickable>
      <template v-for="item in KVs" :key="item.key">
        <NListItem @click="navigateTo(`/guides/${item.key.split(':').pop()}`)">
          <NThing class="thing">
            <template #header>
              <div class="text-xl md:text-2xl font-black">
                {{ item.data.title }}
              </div>
            </template>
            <template #description>
              <NFlex align="center">
                <NAvatar
                  round
                  :src="item.data.authorImage"
                />
                <span class="text-xs md:text-sm">
                  by <strong>{{ item.data.author }}</strong>
                </span>
              </NFlex>
            </template>
            <template #footer>
              <div class="text-xs text-[grey]">
                {{ getDateString(item.data.time) }}
              </div>
            </template>
            <div class="text-xs md:text-sm">
              {{ item.data.description }}
            </div>
          </NThing>
        </NListItem>
      </template>
    </NList>
  </NFlex>
</template>

<style scoped>
.thing {
  padding-left: 1.2rem;
  border-image: linear-gradient(#1b43df 20%, #eb141d 80%) 1;
  border-left: 2px solid;
}
</style>
