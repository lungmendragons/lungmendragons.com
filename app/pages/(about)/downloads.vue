<template>
  <NFlex vertical>
    <div class="mt-4">
      Click an image to download it.
    </div>
    <NDivider />
    <NFlex justify="center">
      <NCard class="w-fit h-[250px]" content-style="padding:8px">
        <template #cover>
          <a download href="/images/ld/lb/LB_CNY.png">
            <NuxtImg src="/images/ld/lb/LB_CNY.png" :height="200" />
          </a>
        </template>
        <div class="text-xs text-center">
          LB_CNY.png<br>4150x4096px, 17.7 MB
        </div>
      </NCard>
      <!-- <NDivider /> -->
      <NCard class="w-fit h-[250px]" content-style="padding:8px">
        <template #cover>
          <a download href="/images/ld/lb/LB_IS4_4thEND_SGL2.png">
            <NuxtImg src="/images/ld/lb/LB_IS4_4thEND_SGL2.png" :height="200" />
          </a>
        </template>
        <div class="text-xs text-center">
          LB_IS4_4thEND_SGL2.png<br>4800x3600px, 20.7 MB
        </div>
      </NCard>
    </NFlex>
  </NFlex>
</template>
