<script setup lang="ts">
import { createGachaSession, singleRoll, tenRoll, type BannerInfo, type RollResult } from "rs-app";
import { useMediaQuery, promiseTimeout } from "@vueuse/core";
import { renderImgComponent, bg, show } from "~/utils/gachasim";
import MaterialSymbolsPause from '~icons/material-symbols/pause';

definePageMeta({
  auth: { only: "member" },
});

const mounted = ref(false);
onMounted(() => mounted.value = true);

interface GachaResult extends RollResult {
  pull: number;
  pity: number;
};

const isMD = useMediaQuery(mediaQuery.minWidth.md);
const message = useMessage();

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
const wallet = ref<number | null>(0);
const walletTemp = ref<number | null>();
const paused = ref(false);

const options = ref({
  showStar: 0b1111,
  infiniteMoney: true,
  pauseAt6: false,
  pauseValue: 1,
});

const pauseValue = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3+", value: 3 },
];

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
  if (!options.value.infiniteMoney && wallet.value !== null) {
    if (wallet.value < 100) {
      message.error("Not enough money!");
      return;
    } else {
      wallet.value -= 100;
    }
  }

  rollType.value = "10";
  const session = createGachaSession(bannerInfo);
  const res = tenRoll(session);
  result10.value = res;
  res.forEach((c) => processRoll(c));

  if (options.value.pauseAt6 && res.filter((c) => c.rarity === 6).length >= options.value.pauseValue) {
    paused.value = true;
    promiseTimeout(1000).then(() => paused.value = false);
  }
}

async function gacha1() {
  if (!options.value.infiniteMoney && wallet.value !== null) {
    if (wallet.value < 10) {
      message.error("Not enough money!");
      return;
    } else {
      wallet.value -= 10;
    }
  }

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
    if (options.value.showStar & 0b0001 && c.rarity === 3) return true;
    if (options.value.showStar & 0b0010 && c.rarity === 4) return true;
    if (options.value.showStar & 0b0100 && c.rarity === 5) return true;
    if (options.value.showStar & 0b1000 && c.rarity === 6) return true;
    return false;
  });
}

function starToggleStyle(star: number) {
  return {
    backgroundColor: show(star, options.value.showStar) ? bg(star) : "#9993",
    color: show(star, options.value.showStar) ? "black" : "#999",
  };
}

function reset() {
  totalPulls.value = 0;
  pity.value = 0;
  result1.value = undefined;
  result10.value = [];
  history.value = [];
}

watch(() => options.value.infiniteMoney, (bool) => {
  if (bool) {
    walletTemp.value = wallet.value;
    wallet.value = null;
  } else if (walletTemp.value) {
    wallet.value = walletTemp.value;
    walletTemp.value = null;
  } else {
    wallet.value = 0;
    walletTemp.value = null;
  }
}, { immediate: true });
</script>

<template>
  <div>
    <LazyGachaSimPreload :hydrate-when="mounted" />
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
      <NSpin
        size="small"
        :rotate="false"
        :show="paused">
        <template #icon>
          <NIcon>
            <MaterialSymbolsPause />
          </NIcon>
        </template>
        <NFlex justify="center">
          <NButton
            secondary
            type="primary"
            :size="isMD ? 'large' : 'small'"
            class="w-28"
            :disabled="!mounted || paused"
            @click="gacha1">
            x1
          </NButton>
          <NButton
            type="primary"
            :size="isMD ? 'large' : 'small'"
            class="w-36"
            :disabled="!mounted || paused"
            @click="gacha10">
            x10
          </NButton>
          <NInputNumber
            :disabled="options.infiniteMoney"
            :show-button="false"
            :max="1000000"
            placeholder="∞"
            :size="isMD ? 'large' : 'small'"
            class="w-28"
            v-model:value="wallet">
            <template #prefix>
              $
            </template>
          </NInputNumber>
        </NFlex>
      </NSpin>
      <NFlex
        justify="space-around"
        size="small"
        class="mx-auto">
        <NFlex class="md:px-12">
          <NFlex
            vertical
            :size="3" 
            class="w-48 md:w-80">
            <NFlex justify="space-between" :style="{ padding: '0.25rem', marginRight: '0.7rem' }">
              <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">Pull</div>
              <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">Character</div>
              <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">Pity</div>
            </NFlex>
            <NVirtualList
              :items="historyFiltered()"
              :item-size="32"
              class="max-h-64 md:max-h-96">
              <template #default="{ item }">
                <NFlex
                  justify="space-between"
                  class="p-0.5 md:p-1 m-0.5 mr-[0.7rem]"
                  :style="{ backgroundColor: `${bg(item.rarity)}44` }">
                  <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">{{ item.pull }}</div>
                  <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">{{ item.character }}</div>
                  <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">{{ item.rarity === 6 ? item.pity : "" }}</div>
                </NFlex>
              </template>
            </NVirtualList>
          </NFlex>
        </NFlex>
        <NFlex
          vertical
          size="small"
          class="w-32 md:w-64 p-1">
          <NFlex
            justify="space-between"
            class="w-full md:w-fit px-1 md:px-2 py-0.5 rounded"
            :style="{ backgroundColor: show(6, options.showStar) ? `${bg(6)}44` : 'transparent' }">
            <div class="text-xs md:text-sm text-center w-5 md:w-8">6★</div>
            <div class="text-xs md:text-sm text-center w-5 md:w-8">{{ count6 }}</div>
            <div class="text-xs md:text-sm text-center w-12 md:w-16">{{ totalPulls ? (100 * count6 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex
            justify="space-between"
            class="w-full md:w-fit px-1 md:px-2 py-0.5 rounded"
            :style="{ backgroundColor: show(5, options.showStar) ? `${bg(5)}44` : 'transparent' }">
            <div class="text-xs md:text-sm text-center w-5 md:w-8">5★</div>
            <div class="text-xs md:text-sm text-center w-5 md:w-8">{{ count5 }}</div>
            <div class="text-xs md:text-sm text-center w-12 md:w-16">{{ totalPulls ? (100 * count5 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex
            justify="space-between"
            class="w-full md:w-fit px-1 md:px-2 py-0.5 rounded"
            :style="{ backgroundColor: show(4, options.showStar) ? `${bg(4)}44` : 'transparent' }">
            <div class="text-xs md:text-sm text-center w-5 md:w-8">4★</div>
            <div class="text-xs md:text-sm text-center w-5 md:w-8">{{ count4 }}</div>
            <div class="text-xs md:text-sm text-center w-12 md:w-16">{{ totalPulls ? (100 * count4 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex
            justify="space-between"
            class="w-full md:w-fit px-1 md:px-2 py-0.5 rounded"
            :style="{ backgroundColor: show(3, options.showStar) ? `${bg(3)}44` : 'transparent' }">
            <div class="text-xs md:text-sm text-center w-5 md:w-8">3★</div>
            <div class="text-xs md:text-sm text-center w-5 md:w-8">{{ count3 }}</div>
            <div class="text-xs md:text-sm text-center w-12 md:w-16">{{ totalPulls ? (100 * count3 / totalPulls).toFixed(2) : "0.00" }}%</div>
          </NFlex>
          <NFlex class="my-2">
            <div class="w-16">
              <div class="pb-1.5">
                Pulls:
              </div>
              <div class="text-xl font-bold">
                {{ totalPulls }}
              </div>
            </div>
            <div class="w-12">
              <div class="pb-1.5">
                Pity:
              </div>
              <div class="text-xl font-bold">
                {{ pity }}
              </div>
            </div>
          </NFlex>
          <NSpace
            class="my-2"
            :size="4"
            align="center">
            List:
            <NTag
              checkable
              strong
              @update:checked="() => options.showStar ^= 0b0001"
              :style="starToggleStyle(3)"
              :checked="show(3, options.showStar)">
              3★
            </NTag>
            <NTag
              checkable
              strong
              @update:checked="() => options.showStar ^= 0b0010"
              :style="starToggleStyle(4)"
              :checked="show(4, options.showStar)">
              4★
            </NTag>
            <NTag
              checkable
              strong
              @update:checked="() => options.showStar ^= 0b0100"
              :style="starToggleStyle(5)"
              :checked="show(5, options.showStar)">
              5★
            </NTag>
            <NTag
              checkable
              strong
              @update:checked="() => options.showStar ^= 0b1000"
              :style="starToggleStyle(6)"
              :checked="show(6, options.showStar)">
              6★
            </NTag>
          </NSpace>
          <NCheckbox
            v-model:checked="options.infiniteMoney"
            :size="isMD ? 'medium' : 'small'"
            class="text-xs md:text-sm">
            Infinite money
          </NCheckbox>
          <NCheckbox
            v-model:checked="options.pauseAt6"
            :size="isMD ? 'medium' : 'small'"
            class="text-xs md:text-sm">
            Pause on 6★ pull
          </NCheckbox>
          <NRadioGroup
            :disabled="!options.pauseAt6"
            v-show="options.pauseAt6"
            v-model:value="options.pauseValue"
            class="mt-1"
            name="pauseAt6Radio">
            <NRadioButton
              v-for="num in pauseValue"
              :key="num.value"
              :value="num.value"
              :label="num.label"
            />
          </NRadioGroup>
          <NButton
            secondary
            type="error"
            :size="isMD ? 'medium' : 'small'"
            class="w-full md:w-fit mt-4"
            :disabled="!mounted"
            @click="reset">
            Reset history
          </NButton>
        </NFlex>
      </NFlex>
    </NFlex>
  </div>
</template>