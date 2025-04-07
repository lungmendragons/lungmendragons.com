<script setup lang="ts">
import { createGachaSession, singleRoll, tenRoll, type BannerInfo, type RollResult } from "rs-app";
import { useMediaQuery } from "@vueuse/core";
import { renderImgComponent, bg } from "~/utils/gachasim";
import { defineAsyncComponent } from "vue";

definePageMeta({
  auth: { only: "member" },
});

const GachaSimPreload = defineAsyncComponent(() => import("~/components/GachaSim/Preload.vue"));
const mounted = ref(false);
onMounted(() => mounted.value = true);

interface GachaResult extends RollResult {
  pull: number;
  pity: number;
};

const rollType = ref<"1" | "10">("10");
const totalPulls = ref(0);
const pity = ref(0);
const result1 = ref<RollResult>();
const result10 = ref<RollResult[]>([]);
const history = ref<GachaResult[]>([]);
const count6 = computed(() => history.value.filter((x) => x.rarity === 6).length);
const count5 = computed(() => history.value.filter((x) => x.rarity === 5).length);
const count4 = computed(() => history.value.filter((x) => x.rarity === 4).length);
const count3 = computed(() => history.value.filter((x) => x.rarity === 3).length);
const isMD = useMediaQuery(mediaQuery.minWidth.md);
const options = ref({
  show6: true,
  show5: true,
  showCommon: true,
});

const bannerInfo: BannerInfo = {
  rate_up: {
    six: [
      "char_249_mlyss",
      ],
    five: [
      "char_135_halo",
      "char_108_silent",
    ],
    four: [],
    three: [],
  },
  off_banner: {
    six: [
      "char_003_kalts",
      "char_010_chen",
      "char_017_huang",
      "char_103_angel",
      "char_112_siege",
      "char_113_cqbw",
      "char_134_ifrit",
      "char_136_hsguma",
      "char_147_shining",
    ],
    five: [
      "char_101_sora",
      "char_102_texas",
      "char_106_franka",
      "char_107_liskam",
      "char_115_headbr",
      "char_128_plosis",
      "char_129_bluep",
      "char_140_whitew",
      "char_143_ghost",
      "char_144_red",
      "char_145_prove",
      "char_148_nearl",
    ],
    four: [
      "char_109_fmout",
      "char_110_deepcl",
      "char_117_myrrh",
      "char_118_yuki",
      "char_126_shotst",
      "char_130_doberm",
      "char_133_mm",
      "char_137_brownb",
      "char_141_nights",
      "char_149_scave",
      "char_150_snakek",
    ],
    three: [
      "char_120_hibisc",
      "char_121_lava",
      "char_122_beagle",
      "char_123_fang",
      "char_124_kroos",
    ],
  },
};

async function gacha10() {
  rollType.value = "10";
  const session = createGachaSession(bannerInfo);
  const res = tenRoll(session);
  result10.value = res;
  res.forEach((c) => processRoll(c));
}

async function gacha1() {
  rollType.value = "1";
  const session = createGachaSession(bannerInfo);
  const res = singleRoll(session);
  result1.value = res;
  processRoll(res);
}

function processRoll(c: RollResult) {
  totalPulls.value++;

  const pull: GachaResult = {
    ...c,
    pull: totalPulls.value,
    pity: -1,
  };
  
  if (c.rarity === 6) {
    const p = pity.value + 1;
    pity.value = 0;
    pull.pity = p;
  } else {
    pity.value++;
    pull.pity = pity.value;
  }

  history.value.push(pull);
}

function historyFiltered() {
  return history.value.toReversed().filter((c) => {
    if (c.rarity === 6 && options.value.show6) return true;
    if (c.rarity === 5 && options.value.show5) return true;
    if (c.rarity < 5 && options.value.showCommon) return true;
    return false;
  });
}

function reset() {
  totalPulls.value = 0;
  pity.value = 0;
  result1.value = undefined;
  result10.value = [];
  history.value = [];
}
</script>

<template>
  <div>
    <!-- Nuxt 3.16 feature - re-enable when bug fixes allow upgrading -->
    <!-- <LazyGachaSimPreload :hydrate-when="mounted" /> -->
    <GachaSimPreload />
    <div v-if="history.length > 0">
      <NFlex
        v-if="rollType === '10'"
        :size="isMD ? 4 : 2"
        justify="center"
        class="my-8">
        <!-- don't use v-for loop here, this is faster and more reliable -->
        <component v-if="result10[0]" :is="renderImgComponent(result10[0], isMD)" />
        <component v-if="result10[1]" :is="renderImgComponent(result10[1], isMD)" />
        <component v-if="result10[2]" :is="renderImgComponent(result10[2], isMD)" />
        <component v-if="result10[3]" :is="renderImgComponent(result10[3], isMD)" />
        <component v-if="result10[4]" :is="renderImgComponent(result10[4], isMD)" />
        <component v-if="result10[5]" :is="renderImgComponent(result10[5], isMD)" />
        <component v-if="result10[6]" :is="renderImgComponent(result10[6], isMD)" />
        <component v-if="result10[7]" :is="renderImgComponent(result10[7], isMD)" />
        <component v-if="result10[8]" :is="renderImgComponent(result10[8], isMD)" />
        <component v-if="result10[9]" :is="renderImgComponent(result10[9], isMD)" />
      </NFlex>
      <NFlex
        v-else-if="rollType === '1'"
        :size="isMD ? 4 : 2"
        justify="center"
        class="my-8">
        <component v-if="result1" :is="renderImgComponent(result1, isMD)" />
      </NFlex>
    </div>
    <div v-else>
      <div class="text-center my-8 h-[220px] leading-[220px]">
        <div v-if="!mounted">
          Loading...
        </div>
        <div v-else>
          Loaded! Waiting...
        </div>
      </div>
    </div>
    <NFlex vertical>
      <NFlex justify="center">
        <NButton
          type="primary"
          size="large"
          class="w-64 mb-4"
          :disabled="!mounted"
          @click="gacha10">
          x10
        </NButton>
        <NButton
          secondary
          type="primary"
          size="large"
          class="w-16 mb-4"
          :disabled="!mounted"
          @click="gacha1">
          x1
        </NButton>
      </NFlex>
      <NFlex justify="space-around" class="w-2/3 mx-auto">
        <NFlex class="px-12">
          <NScrollbar class="max-h-96 w-fit pr-3">
            <NFlex
              vertical
              justify="center"
              :size="3" 
              class="w-80">
              <NFlex justify="space-between" :style="{ padding: '0.25rem' }">
                <div class="min-w-12 text-center">Pull</div>
                <div class="min-w-12 text-center">Character</div>
                <div class="min-w-12 text-center">Pity</div>
              </NFlex>
              <div v-for="(c, i) in historyFiltered()" :key="i">
                <NFlex
                  justify="space-between"
                  :style="{ backgroundColor: `${bg(c.rarity)}44`, padding: '0.25rem' }">
                  <div class="min-w-12 text-center">{{ c.pull }}</div>
                  <div class="min-w-12 text-center">{{ c.character }}</div>
                  <div class="min-w-12 text-center">{{ c.rarity === 6 ? c.pity : "" }}</div>
                </NFlex>
              </div>
            </NFlex>
          </NScrollbar>
        </NFlex>
        <NFlex
          vertical
          class="w-40 mx-12 p-1">
          <NFlex>
            <div class="text-center w-8">6★</div>
            <div class="text-center w-8">{{ count6 }}</div>
            <div class="text-center w-12">{{ totalPulls ? (100 * count6 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex>
            <div class="text-center w-8">5★</div>
            <div class="text-center w-8">{{ count5 }}</div>
            <div class="text-center w-12">{{ totalPulls ? (100 * count5 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex>
            <div class="text-center w-8">4★</div>
            <div class="text-center w-8">{{ count4 }}</div>
            <div class="text-center w-12">{{ totalPulls ? (100 * count4 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex>
            <div class="text-center w-8">3★</div>
            <div class="text-center w-8">{{ count3 }}</div>
            <div class="text-center w-12">{{ totalPulls ? (100 * count3 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          Pulls: {{ totalPulls }}
          <br>
          Pity: {{ pity }}
          <br>
          <NCheckbox v-model:checked="options.show6">
            List 6★ pulls
          </NCheckbox>
          <NCheckbox v-model:checked="options.show5">
            List 5★ pulls
          </NCheckbox>
          <NCheckbox v-model:checked="options.showCommon">
            List 4★/3★ pulls
          </NCheckbox>
          <NButton
            secondary
            type="error"
            :disabled="!mounted"
            @click="reset">
            Reset history
          </NButton>
        </NFlex>
      </NFlex>
    </NFlex>
  </div>
</template>