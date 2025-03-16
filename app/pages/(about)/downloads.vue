<template>
  <NFlex vertical>
    <div class="mt-4">
      Click an image to download it.
    </div>
    <NDivider />
    <NFlex justify="center">
      <NCard class="max-w-[300px] h-[250px]" content-style="padding:8px">
        <template #cover>
          <a download href="/images/ld/lb/LB_CNY.png">
            <NuxtImg src="https://lungmendragons.com/images/ld/lb/LB_CNY.png" :height="200" />
          </a>
        </template>
        <div class="text-xs text-center">
          LB_CNY.png<br>4150x4096px, 17.7 MB
        </div>
      </NCard>
      <!-- <NDivider /> -->
      <NCard class="max-w-[300px] h-[250px]" content-style="padding:8px">
        <template #cover>
          <a download href="/images/ld/lb/LB_IS4_4thEND_SGL2.png">
            <NuxtImg src="https://lungmendragons.com/images/ld/lb/LB_IS4_4thEND_SGL2.png" :height="200" />
          </a>
        </template>
        <div class="text-xs text-center">
          LB_IS4_4thEND_SGL2.png<br>4800x3600px, 20.7 MB
        </div>
      </NCard>
      <NCard class="max-w-[300px] h-[250px]" content-style="padding:8px">
        <template #cover>
          <a download href="/images/ld/lb/0_CONCEPTART_LUNGBAO_ORIGINAL.png">
            <NuxtImg src="https://lungmendragons.com/images/ld/lb/0_CONCEPTART_LUNGBAO_ORIGINAL.png" :height="200" />
          </a>
        </template>
        <div class="text-xs text-center">
          0_CONCEPTART_LUNGBAO_ORIGINAL.png<br>5355x2665px, 4.84 MB
        </div>
      </NCard>
    </NFlex>
  </NFlex>
</template>
