<script setup lang="ts">
import LoadingDotsAnim from "~/components/SVG/LoadingDotsAnim.vue";
import LogoColorIcon from "~/components/Logo/ColorIcon.vue";

useSeoMeta({
  title: "Guides | Lungmen Dragons",
});

const KVs = ref<[{
  key: string;
  data: {
    title: string;
    description: string;
    time: number;
    author: Ref<string>;
    authorImage?: Ref<string>;
  };
}] | []>([]);

const isLoaded = ref(false);

// This block is a complete mess and I make no apology for it
onMounted(() => {
  $fetch("/api/pages/guides/endfield")
    .then((guides: any) => {
      for (const guide of guides) {
        const name = ref<string>("");
        const image = ref<string>("");
        $fetch(`/api/users/${guide.metadata.author}`).then((user) => {
          // @ts-expect-error possibly null/not assignable/property does not exist
          name.value = user.name;
          // @ts-expect-error as above
          image.value = user.image;
        });

        // @ts-expect-error leave me alone
        KVs.value.push({
          key: guide.key,
          data: {
            title: guide.metadata.title,
            description: guide.metadata.description,
            time: guide.metadata.time,
            author: name,
            authorImage: image,
          },
        });
      }
    })
    .then(() => {
      isLoaded.value = true;
      KVs.value.sort((a, b) => b.data.time - a.data.time);
    });
});

function getDateString(time: number): string {
  return new Date(time).toLocaleString(
    undefined,
    { weekday: "short", day: "numeric", month: "long", year: "numeric" },
  );
};
</script>

<template>
  <NFlex vertical class="w-full md:w-4/5 max-w-[800px] mx-auto">
    <Teleport to="#teleports" :disabled="isLoaded">
      <NFlex
        vertical
        justify="center"
        :style="{ display: isLoaded ? 'none' : 'flex', margin: 'auto', height: '70svh' }">
        <LogoColorIcon :style="{ width: 72, height: 72, margin: '12px auto' }" />
        <LoadingDotsAnim :style="{ width: 24, height: 24, margin: '0 auto' }" />
      </NFlex>
    </Teleport>
    <NFlex align="center" class="mb-2">
      <NImage
        src="/official/endfield-icon.png"
        width="48"
        height="48"
      />
      <span class="text-2xl">Arknights: Endfield Guides</span>
    </NFlex>
    <NList hoverable clickable>
      <template v-for="item in KVs" :key="item.key">
        <NListItem @click="navigateTo(`/guides/endfield/${item.key.split(':').pop()}`)">
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
