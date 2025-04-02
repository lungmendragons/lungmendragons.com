<script setup lang="ts">
import { createGachaSession, tenRoll, type BannerInfo, type RollResult } from "rs-app";
import type { CSSProperties } from "vue";
import { useMediaQuery } from "@vueuse/core";

definePageMeta({
  auth: { only: "member" },
});

const totalPulls = ref(0);
const pity = ref(0);
const result = ref<RollResult[]>([]);
const count6 = ref(0);
const count5 = ref(0);
const count4 = ref(0);
const count3 = ref(0);
const isMD = useMediaQuery(mediaQuery.minWidth.md);

function bg(r: number | undefined) {
  switch (r) {
    case 3: return "#3495eb";
    case 4: return "#dfbdf2";
    case 5: return "#fff0b8";
    case 6: return "#ed7b18";
    default: return "#000000";
  }
}

function tenStyle(r: number | undefined): CSSProperties {
  return {
    backgroundColor: bg(r),
    width: isMD.value ? "80px" : "30px",
    height: isMD.value ? "220px" : "78px",
    objectFit: "cover",
  }
}

async function doGacha() {
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

  const session = createGachaSession(bannerInfo);
  const res = tenRoll(session);
  result.value = res;
  res.forEach((c) => {
    switch (c.rarity) {
      case 6:
        count6.value++;
        break;
      case 5:
        count5.value++;
        break;
      case 4:
        count4.value++;
        break;
      case 3:
        count3.value++;
        break;
      default:
        break;
    }
  });
  totalPulls.value += 10;
  if (result.value.filter((c) => c.rarity === 6).length > 0) {
    const i = result.value.findLastIndex((c) => c.rarity === 6);
    pity.value = 9 - i;
  } else {
    pity.value += 10;
  }
}
</script>

<template>
  <div>
    <NButton @click="doGacha">pull</NButton>
    <br>
    Pulls: {{ totalPulls }}<br>
    Pity: {{ pity }}<br>
    isMD: {{ isMD }}<br>
    <div v-if="result.length === 10">
      <NFlex
        :size="isMD ? [4,4] : [2,2]"
        justify="center"
        class="my-8">
        <img :src="`images/akresource/charpor/${result[0]?.character}_1.png`" :style="tenStyle(result[0]?.rarity)">
        <img :src="`images/akresource/charpor/${result[1]?.character}_1.png`" :style="tenStyle(result[1]?.rarity)">
        <img :src="`images/akresource/charpor/${result[2]?.character}_1.png`" :style="tenStyle(result[2]?.rarity)">
        <img :src="`images/akresource/charpor/${result[3]?.character}_1.png`" :style="tenStyle(result[3]?.rarity)">
        <img :src="`images/akresource/charpor/${result[4]?.character}_1.png`" :style="tenStyle(result[4]?.rarity)">
        <img :src="`images/akresource/charpor/${result[5]?.character}_1.png`" :style="tenStyle(result[5]?.rarity)">
        <img :src="`images/akresource/charpor/${result[6]?.character}_1.png`" :style="tenStyle(result[6]?.rarity)">
        <img :src="`images/akresource/charpor/${result[7]?.character}_1.png`" :style="tenStyle(result[7]?.rarity)">
        <img :src="`images/akresource/charpor/${result[8]?.character}_1.png`" :style="tenStyle(result[8]?.rarity)">
        <img :src="`images/akresource/charpor/${result[9]?.character}_1.png`" :style="tenStyle(result[9]?.rarity)">
      </NFlex>
    </div>
    <div v-else>
      waiting...
    </div>
    <div>
      6: {{ count6 }}<br>
      5: {{ count5 }}<br>
      4: {{ count4 }}<br>
      3: {{ count3 }}<br>
    </div>
  </div>
</template>