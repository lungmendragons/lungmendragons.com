<script setup lang="ts">
import { createGachaSession, singleRoll, tenRoll, type RollResult, type GachaSession, type BannerInfo } from "rs-app";
import { useMediaQuery, promiseTimeout } from "@vueuse/core";
import { getCNBannerData, renderImgComponent, bg, show } from "~/utils/gachasim";
import { NBadge, NPopover, type TreeSelectOption, type TreeSelectOverrideNodeClickBehaviorReturn } from "naive-ui";
import MaterialSymbolsPause from "~icons/material-symbols/pause";
import type { VNodeChild } from "vue";

useSeoMeta({
  title: "Gacha Simulator | Lungmen Dragons",
});

interface GachaResult extends RollResult {
  name: string;
  pull: number;
  pity: number;
};

enum BannerType {
  PERMANENT = "PERMANENT", // Standard banner (2 rate ups)
  STD_OLD = "STANDARD_OLD", // Old event banner (1 rate up, no guarantee)
  STD_NEW = "STANDARD_NEW", // New event banner (1 rate up, 150 guarantee)
  // LTD_OLD = "LIMITED_OLD", // Limited banner (2 rate ups, no guarantee)
  // LTD_NEW = "LIMITED_NEW", // Limited banner (2 rate ups, no guarantee, with secondary rate ups)
  LIMITED = "LIMITED",
  COLLAB = "COLLAB", // Collab banner (1 rate up, 120 guarantee)
};

const mounted = ref(false);
const isMD = useMediaQuery(mediaQuery.minWidth.md);
const message = useMessage();

const activeBanner = ref<{
  id: string;
  data: BannerInfo;
}>({
  id: "SINGLE_55_0_1",
  data: {
    banner_type: BannerType.STD_NEW,
    rate_up: {
      six: [],
      five: [],
      four: [],
      three: [],
    },
    off_banner: {
      six: [],
      five: [],
      four: [],
      three: [],
    },
  },
});

const gacha: { session: GachaSession } = {
  session: createGachaSession(activeBanner.value.data),
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
const wallet = ref(0);
const paused = ref(false);

const options = ref({
  showStar: 0b1111,
  kazdelKasino: true,
  pauseAt6: false,
  pauseValue: 1,
});

const pauseValue = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3+", value: 3 },
];

let banners: Array<{
  id: string;
  offBanners: any[];
  rateUp: any[];
  minorRateUp: any[];
}>;

let characters: {
  [key: string]: string;
};

let bannerTree: Array<{
  label: string;
  key: string;
  children: Array<{ label: string; key: string }>;
}>;

let bannerPreload: RollResult[];

onMounted(() => {
  getCNBannerData().then((res) => {
    banners = res.banners;
    characters = res.characters;
    // const bannerTypes = [...new Set(banners.map((b) => b.id.split("_")[0]))];
    const bannerTypes = [ "NORM", "SINGLE", "DOUBLE", "LIMITED", "LINKAGE" ];
    bannerTree = Array.from(bannerTypes as string[], (type: string) => {
      return {
        label: type,
        key: type,
        children: banners.filter((b) => b.id.startsWith(type)).map((b) => {
          return {
            label: b.id,
            key: b.id,
          };
        }),
      };
    });
    loadBanner(activeBanner.value.id);
    mounted.value = true;
  })
});

function loadBanner(id: string) {
  if (!bannerTree) return;

  paused.value = true;
  const banner = banners.find((b) => b.id === id);

  if (banner) {
    const findRankUp = (r: number) => banner.rateUp.find((c) => c.rarityRank === r);
    const findRankOff = (r: number) => banner.offBanners.find((c) => c.rarityRank === r);

    activeBanner.value.id = banner.id;
    const data = activeBanner.value.data;
    data.rate_up.six = findRankUp(5) ? findRankUp(5).charIdList : [];
    data.rate_up.five = findRankUp(4) ? findRankUp(4).charIdList : [];
    data.rate_up.four = findRankUp(3) ? findRankUp(3).charIdList : [];
    data.rate_up.three = findRankUp(2) ? findRankUp(2).charIdList : [];
    data.off_banner.six = findRankOff(5) ? findRankOff(5).charIdList : [];
    data.off_banner.five = findRankOff(4) ? findRankOff(4).charIdList : [];
    data.off_banner.four = findRankOff(3) ? findRankOff(3).charIdList : [];
    data.off_banner.three = findRankOff(2) ? findRankOff(2).charIdList : [];

    if (banner.minorRateUp.length > 0) {
      banner.minorRateUp.forEach((x) => {
        if (x.rarityRank === 5) {
          // Add to off-banner pool 5 times to simplify the rs-app logic
          for (let i = 0; i < 5; i++) {
            data.off_banner.six.push(x.charId);
          }
        } 
      });
    }

    // All units are in the off-banner pool
    bannerPreload = [
      data.off_banner.six.map(x => {
        return { character: x, rarity: 6 };
      }),
      data.off_banner.five.map(x => {
        return { character: x, rarity: 5 };
      }),
      data.off_banner.four.map(x => {
        return { character: x, rarity: 4 };
      }),
      data.off_banner.three.map(x => {
        return { character: x, rarity: 3 };
      }),
    ].flat();

    switch (banner.id.split("_")[0]) {
      case "LIMITED":
        // banner.minorRateUp.length > 0
        //   ? data.banner_type = BannerType.LTD_NEW
        //   : data.banner_type = BannerType.LTD_OLD;
        data.banner_type = BannerType.LIMITED;
        break;
      case "LINKAGE":
        data.banner_type = BannerType.COLLAB;
        break;
      case "SINGLE":
        data.banner_type = BannerType.STD_NEW;
        break;
      case "DOUBLE":
        data.banner_type = BannerType.PERMANENT;
        break;
      case "NORM":
        findRankUp(5).length > 1
          ? data.banner_type = BannerType.PERMANENT
          : data.banner_type = BannerType.STD_OLD;
        break;
      default:
        data.banner_type = BannerType.STD_OLD;
        break;
    }

    gacha.session = createGachaSession(activeBanner.value.data);
    message.success(`Loaded: ${banner.id}`);
    paused.value = false;
  } else {
    message.error("Failed to load banner.");
  }
}

async function gacha10() {
  if (options.value.kazdelKasino && wallet.value !== null) {
    if (wallet.value < 100) {
      message.error("Not enough money!");
      return;
    } else {
      wallet.value -= 100;
    }
  }

  rollType.value = "10";
  const res = tenRoll(gacha.session);
  result10.value = res;
  res.forEach((c) => processRoll(c));

  if (options.value.pauseAt6 && res.filter((c) => c.rarity === 6).length >= options.value.pauseValue) {
    paused.value = true;
    promiseTimeout(1000).then(() => paused.value = false);
  }
}

async function gacha1() {
  if (options.value.kazdelKasino && wallet.value !== null) {
    if (wallet.value < 10) {
      message.error("Not enough money!");
      return;
    } else {
      wallet.value -= 10;
    }
  }

  rollType.value = "1";
  const res = singleRoll(gacha.session);
  result1.value = res;
  processRoll(res);
}

function processRoll(c: RollResult) {
  totalPulls.value++;

  const pull: GachaResult = {
    ...c,
    name: characters[c.character] ?? c.character,
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
  gacha.session = createGachaSession(activeBanner.value.data);
}

function override(info: { option: TreeSelectOption }): TreeSelectOverrideNodeClickBehaviorReturn {
  return info.option.children ? "toggleExpand" : "default";
}

function treePop(info: {
  option: TreeSelectOption;
  checked: boolean;
  selected: boolean;
}): VNodeChild {
  const banner = banners.find((b) => b.id === info.option.key);
  const up6 = banner?.rateUp.find((c) => c.rarityRank === 5)?.charIdList.map((c: string) => characters[c]) ?? [];
  const up5 = banner?.rateUp.find((c) => c.rarityRank === 4)?.charIdList.map((c: string) => characters[c]) ?? [];
  const up4 = banner?.rateUp.find((c) => c.rarityRank === 3)?.charIdList.map((c: string) => characters[c]) ?? [];
  return h(
    NPopover,
    {
      trigger: "hover",
      placement: "left",
      showArrow: true,
      style: {
        backgroundColor: "#9993",
        fontSize: "0.75rem",
        padding: "0.25rem 0.5rem",
      },
    },
    {
      default: () => info.option.children
        ? null
        : info.option.label,
      trigger: () => info.option.children
        ? info.option.label
        : h(
            "div",
            { class: "text-xs" },
            [
              h("div", null, [ h(NBadge, { value: "6★", color: `${bg(6)}66`, style: { paddingRight: "0.25rem" } }), up6.join(", ") ]),
              h("div", null, [ h(NBadge, { value: "5★", color: `${bg(5)}66`, style: { paddingRight: "0.25rem" } }), up5.join(", ") ]),
              up4.length
                ? h("div", null, [ h(NBadge, { value: "4★", color: `${bg(4)}66`, style: { paddingRight: "0.25rem" } }), up4.join(", ") ])
                : null,
            ],
          ),
    },
  )
}
</script>

<template>
  <div>
    <LazyGachaSimPreload :preload="bannerPreload" :hydrate-when="mounted" />
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
            {{ options.kazdelKasino ? "x1 ($10)" : "x1" }}
          </NButton>
          <NButton
            type="primary"
            :size="isMD ? 'large' : 'small'"
            class="w-36"
            :disabled="!mounted || paused"
            @click="gacha10">
            {{ options.kazdelKasino ? "x10 ($100)" : "x10" }}
          </NButton>
          <NInputNumber
            v-show="options.kazdelKasino"
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
              class="max-h-96">
              <template #default="{ item }">
                <NFlex
                  justify="space-between"
                  class="p-0.5 md:p-1 m-0.5 mr-[0.7rem]"
                  :style="{ backgroundColor: `${bg(item.rarity)}44` }">
                  <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">{{ item.pull }}</div>
                  <div class="min-w-8 md:min-w-12 text-center text-xs md:text-sm">{{ item.name }}</div>
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
          <NTreeSelect
            :options="bannerTree"
            :override-default-node-click-behavior="override"
            :render-label="treePop"
            default-value="SINGLE_55_0_1"
            @update:value="loadBanner"
          />
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
            <div class="w-12">
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
            v-model:checked="options.kazdelKasino"
            :size="isMD ? 'medium' : 'small'"
            class="text-xs md:text-sm">
            <div :style="{
              filter: options.kazdelKasino ? 'drop-shadow(0 0 3px crimson)' : 'none',
              fontWeight: options.kazdelKasino ? 'bold' : 'normal',
            }">
              Kazdel Kasino
            </div>
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